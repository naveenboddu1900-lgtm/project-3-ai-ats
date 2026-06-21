import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Mail } from 'lucide-react';
import { Box, Button, Card, CardContent, Chip, Grid2, LinearProgress, Stack, Typography } from '@mui/material';
import { api } from '../services/api.js';

const stages = ['Applied', 'Screening', 'Interview', 'Offered'];

const stageImages = {
  Applied: {
    src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    alt: 'Applicant resume review workspace'
  },
  Screening: {
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    alt: 'Recruiter screening candidate profiles'
  },
  Interview: {
    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80',
    alt: 'Interview conversation with hiring team'
  },
  Offered: {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
    alt: 'Successful hiring agreement'
  }
};

export default function PipelinePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: async () => (await api.get('/applications/pipeline')).data
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }) => (await api.patch(`/applications/${id}/stage`, { stage })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pipeline'] })
  });

  const notify = useMutation({
    mutationFn: async (id) => (await api.post(`/applications/${id}/notify`)).data
  });

  const grouped = data?.stages || {};

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Application Pipeline</Typography>
        <Typography color="text.secondary">Move candidates from applied to offer with recruiter actions.</Typography>
      </Box>
      {isLoading && <LinearProgress />}
      <Grid2 container spacing={2} className="pipeline-grid">
        {stages.map((stage) => (
          <Grid2 key={stage} size={{ xs: 12, md: 3 }}>
            <Box className="pipeline-column">
              <Box className="pipeline-stage-image">
                <img src={stageImages[stage].src} alt={stageImages[stage].alt} />
              </Box>
              <Typography variant="h6">{stage}</Typography>
              <Stack spacing={1.5}>
                {(grouped[stage] || []).map((application) => {
                  const nextStage = stages[stages.indexOf(stage) + 1];
                  return (
                    <Card key={application.id}>
                      <CardContent>
                        <Stack spacing={1.25}>
                          <Typography fontWeight={700}>{application.candidateName}</Typography>
                          <Typography color="text.secondary" variant="body2">{application.jobTitle}</Typography>
                          <Chip label={`${application.matchScore}% match`} size="small" color="primary" />
                          <Typography variant="body2" className="line-clamp">{application.summary}</Typography>
                          <Stack direction="row" spacing={1}>
                            {nextStage && (
                              <Button
                                size="small"
                                variant="outlined"
                                endIcon={<ArrowRight size={16} />}
                                onClick={() => updateStage.mutate({ id: application.id, stage: nextStage })}
                              >
                                Move
                              </Button>
                            )}
                            <Button size="small" startIcon={<Mail size={16} />} onClick={() => notify.mutate(application.id)}>
                              Email
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
