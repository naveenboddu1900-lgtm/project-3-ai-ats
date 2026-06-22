import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Plus, Save } from 'lucide-react';
import {
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
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { api } from '../services/api.js';

const initialJob = {
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  description: '',
  skills: ''
};

export default function RecruiterDashboard() {
  const queryClient = useQueryClient();
  const [job, setJob] = useState(initialJob);
  const [selectedJob, setSelectedJob] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => (await api.get('/jobs')).data
  });

  const createJob = useMutation({
    mutationFn: async (payload) => (await api.post('/jobs', payload)).data,
    onSuccess: () => {
      setJob(initialJob);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  const jobs = data?.jobs || [];

  function candidateApplyLink(jobId) {
    return `${window.location.origin}/apply/${jobId}`;
  }

  function update(field, value) {
    setJob((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    createJob.mutate({
      ...job,
      skills: job.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    });
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Recruiter Dashboard</Typography>
        <Typography color="text.secondary">Create jobs, track applicant volume, and keep openings moving.</Typography>
      </Box>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} component="form" onSubmit={submit}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Plus size={20} />
                  <Typography variant="h6">New Job</Typography>
                </Stack>
                <TextField label="Title" value={job.title} onChange={(event) => update('title', event.target.value)} required />
                <TextField label="Department" value={job.department} onChange={(event) => update('department', event.target.value)} required />
                <TextField label="Location" value={job.location} onChange={(event) => update('location', event.target.value)} required />
                <TextField label="Employment type" value={job.type} onChange={(event) => update('type', event.target.value)} />
                <TextField
                  label="Required skills"
                  value={job.skills}
                  onChange={(event) => update('skills', event.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
                <TextField
                  label="Description"
                  value={job.description}
                  onChange={(event) => update('description', event.target.value)}
                  multiline
                  minRows={5}
                  required
                />
                <Button type="submit" variant="contained" startIcon={<Save size={18} />} disabled={createJob.isPending}>
                  Save job
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          {isLoading && <LinearProgress />}
          <Grid2 container spacing={2}>
            {jobs.map((item) => (
              <Grid2 key={item.id} size={{ xs: 12, lg: 6 }}>
                <Card
                  className="interactive-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedJob(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedJob(item);
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Box>
                          <Typography variant="h6">{item.title}</Typography>
                          <Typography color="text.secondary">{item.department} - {item.location}</Typography>
                        </Box>
                        <Chip size="small" label={item.status} color={item.status === 'open' ? 'success' : 'default'} />
                      </Stack>
                      <Typography className="line-clamp">{item.description}</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {item.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                      </Stack>
                      <Stack direction="row" gap={2}>
                        <Typography variant="body2" color="text.secondary">{item.applicationCount} applicants</Typography>
                        <Typography variant="body2" color="text.secondary">Avg score {item.averageScore}%</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>

      <Dialog open={Boolean(selectedJob)} onClose={() => setSelectedJob(null)} maxWidth="md" fullWidth>
        {selectedJob && (
          <>
            <DialogTitle>
              <Stack spacing={0.75}>
                <Typography variant="h5">{selectedJob.title}</Typography>
                <Typography color="text.secondary">
                  {selectedJob.department} - {selectedJob.location} - {selectedJob.type}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pb: 1 }}>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip label={selectedJob.status} color={selectedJob.status === 'open' ? 'success' : 'default'} />
                  <Chip label={`${selectedJob.applicationCount} applicants`} />
                  <Chip label={`Average score ${selectedJob.averageScore}%`} color="primary" />
                </Stack>
                <Box>
                  <Typography variant="overline" color="text.secondary">Job description</Typography>
                  <Typography>{selectedJob.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Required skills</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} mt={0.5}>
                    {selectedJob.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Candidate apply link</Typography>
                  <Typography variant="body2" className="job-link">
                    {candidateApplyLink(selectedJob.id)}
                  </Typography>
                </Box>
                <Stack direction="row" justifyContent="flex-end" gap={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<ExternalLink size={16} />}
                    onClick={() => window.open(candidateApplyLink(selectedJob.id), '_blank', 'noopener,noreferrer')}
                  >
                    Open apply page
                  </Button>
                  <Button variant="contained" onClick={() => setSelectedJob(null)}>Close</Button>
                </Stack>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Stack>
  );
}
