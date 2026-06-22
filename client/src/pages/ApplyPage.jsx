import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileUp, Send } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ApplyPage() {
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-data'],
    queryFn: async () => (await api.get('/candidate/portal')).data
  });

  const jobs = useMemo(() => data?.jobs || [], [data?.jobs]);
  const job = jobs.find((item) => String(item.id) === String(jobId));

  const apply = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('jobId', jobId);
      form.append('coverLetter', coverLetter);
      if (resume) form.append('resume', resume);
      return (await api.post('/applications', form)).data;
    },
    onSuccess: () => {
      setResume(null);
      setCoverLetter('');
      queryClient.invalidateQueries({ queryKey: ['candidate-data'] });
    }
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={Link} to="/candidate" startIcon={<ArrowLeft size={18} />}>
          Candidate portal
        </Button>
        <Typography variant="h4" mt={1}>Apply for job</Typography>
        <Typography color="text.secondary">Review the opening and submit your application.</Typography>
      </Box>

      {isLoading && <LinearProgress />}
      {!isLoading && !job && <Alert severity="error">This job is not available for applications.</Alert>}

      {job && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5">{job.title}</Typography>
                    <Typography color="text.secondary">{job.department} - {job.location} - {job.type}</Typography>
                  </Box>
                  <Typography>{job.description}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {job.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Stack spacing={2} component="form" onSubmit={(event) => { event.preventDefault(); apply.mutate(); }}>
                  <Typography variant="h6">Application</Typography>
                  {apply.isSuccess && (
                    <Alert severity="success">
                      Applied successfully. Stage: {apply.data.application.stage}. Match score: {apply.data.application.matchScore}%.
                    </Alert>
                  )}
                  {apply.isError && (
                    <Alert severity="error">
                      {apply.error?.response?.data?.message || 'Unable to submit application.'}
                    </Alert>
                  )}
                  <Button component="label" variant="outlined" startIcon={<FileUp size={18} />}>
                    {resume ? resume.name : 'Upload resume'}
                    <input hidden type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setResume(event.target.files?.[0] || null)} />
                  </Button>
                  <TextField
                    label="Cover letter"
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    multiline
                    minRows={7}
                  />
                  <Button type="submit" variant="contained" startIcon={<Send size={18} />} disabled={apply.isPending}>
                    {apply.isPending ? 'Applying...' : 'Apply now'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}
    </Stack>
  );
}
