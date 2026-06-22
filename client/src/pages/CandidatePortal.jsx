import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, FileUp, Send } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function CandidatePortal() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState('');
  const [openJob, setOpenJob] = useState(null);
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

  const jobs = useMemo(() => data?.jobs || [], [data?.jobs]);
  const applications = data?.applications || [];

  useEffect(() => {
    const jobId = searchParams.get('job');
    const linkedJob = jobs.find((job) => String(job.id) === jobId);
    if (linkedJob) {
      setSelectedJob(jobId);
      setOpenJob(linkedJob);
    }
  }, [jobs, searchParams]);

  function applyLink(jobId) {
    return `/apply/${jobId}`;
  }

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
                {apply.isError && (
                  <Alert severity="error">
                    {apply.error?.response?.data?.message || 'Unable to submit application.'}
                  </Alert>
                )}
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
                  {apply.isPending ? 'Applying...' : 'Apply'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Open demo jobs</Typography>
              <Grid2 container spacing={2}>
                {jobs.map((job) => {
                  const jobLink = `${window.location.origin}${applyLink(job.id)}`;
                  return (
                    <Grid2 key={job.id} size={{ xs: 12, lg: 6 }}>
                      <Card className="job-card">
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                              <Box>
                                <Typography variant="h6">{job.title}</Typography>
                                <Typography color="text.secondary">{job.department} - {job.location}</Typography>
                              </Box>
                              <Chip size="small" label={job.type} color="primary" variant="outlined" />
                            </Stack>
                            <Typography className="line-clamp">{job.description}</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {job.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                            </Stack>
                            <Typography variant="body2" className="job-link">{jobLink}</Typography>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                              <Button component={Link} to={applyLink(job.id)} variant="contained" size="small">
                                Apply
                              </Button>
                              <Button variant="outlined" size="small" startIcon={<ExternalLink size={16} />} onClick={() => setOpenJob(job)}>
                                Open
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid2>
                  );
                })}
              </Grid2>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Applications</Typography>
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
            </Box>
          </Stack>
        </Grid2>
      </Grid2>

      <Dialog open={Boolean(openJob)} onClose={() => setOpenJob(null)} maxWidth="md" fullWidth>
        {openJob && (
          <>
            <DialogTitle>
              <Stack spacing={0.75}>
                <Typography variant="h5">{openJob.title}</Typography>
                <Typography color="text.secondary">
                  {openJob.department} - {openJob.location} - {openJob.type}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pb: 1 }}>
                <Typography>{openJob.description}</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {openJob.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                </Stack>
                <Typography variant="body2" className="job-link">
                  {`${window.location.origin}${applyLink(openJob.id)}`}
                </Typography>
                <Stack direction="row" justifyContent="flex-end" gap={1}>
                  <Button variant="outlined" onClick={() => setOpenJob(null)}>Close</Button>
                  <Button component={Link} to={applyLink(openJob.id)} variant="contained">
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Stack>
  );
}
