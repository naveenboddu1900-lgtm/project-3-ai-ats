import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileUp, Send } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { api } from '../services/api.js';

export default function CandidatePortal() {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-data'],
    queryFn: async () => (await api.get('/candidate/portal')).data
  });

  const apply = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('jobId', selectedJob);
      form.append('coverLetter', coverLetter);
      if (resume) form.append('resume', resume);
      return (await api.post('/applications', form)).data;
    },
    onSuccess: () => {
      setSelectedJob('');
      setResume(null);
      setCoverLetter('');
      queryClient.invalidateQueries({ queryKey: ['candidate-data'] });
    }
  });

  const jobs = data?.jobs || [];
  const applications = data?.applications || [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Candidate Portal</Typography>
        <Typography color="text.secondary">Apply to active openings and follow your application history.</Typography>
      </Box>
      {isLoading && <LinearProgress />}
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} component="form" onSubmit={(event) => { event.preventDefault(); apply.mutate(); }}>
                <Typography variant="h6">Submit application</Typography>
                {apply.isSuccess && <Alert severity="success">Application submitted and scored.</Alert>}
                <TextField
                  select
                  label="Job"
                  value={selectedJob}
                  onChange={(event) => setSelectedJob(event.target.value)}
                  required
                >
                  {jobs.map((job) => <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>)}
                </TextField>
                <Button component="label" variant="outlined" startIcon={<FileUp size={18} />}>
                  {resume ? resume.name : 'Upload resume'}
                  <input hidden type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setResume(event.target.files?.[0] || null)} />
                </Button>
                <TextField
                  label="Cover letter"
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  multiline
                  minRows={6}
                />
                <Button type="submit" variant="contained" startIcon={<Send size={18} />} disabled={!selectedJob || apply.isPending}>
                  Apply
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Grid2 container spacing={2}>
            {applications.map((application) => (
              <Grid2 key={application.id} size={{ xs: 12, lg: 6 }}>
                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">{application.jobTitle}</Typography>
                        <Chip label={`${application.matchScore}%`} color="primary" />
                      </Stack>
                      <Typography color="text.secondary">Stage: {application.stage}</Typography>
                      <Typography>{application.summary}</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {application.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>
    </Stack>
  );
}
