import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid2,
  LinearProgress,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { api } from '../services/api.js';

export default function RankingPage() {
  const [skill, setSkill] = useState('');
  const [score, setScore] = useState(70);
  const { data, isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => (await api.get('/applications/ranking')).data
  });

  const skills = data?.skills || [];
  const filtered = useMemo(() => {
    return (data?.applications || []).filter((application) => {
      const scoreMatch = application.matchScore >= score;
      const skillMatch = !skill || application.skills.includes(skill);
      return scoreMatch && skillMatch;
    });
  }, [data, score, skill]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Candidate Ranking</Typography>
        <Typography color="text.secondary">Filter by AI score, skills, and experience signals.</Typography>
      </Box>
      {isLoading && <LinearProgress />}
      <Card>
        <CardContent>
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography fontWeight={700}>Minimum match score: {score}%</Typography>
              <Slider value={score} min={0} max={100} step={5} onChange={(_, value) => setScore(value)} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField select fullWidth label="Skill" value={skill} onChange={(event) => setSkill(event.target.value)}>
                <MenuItem value="">All skills</MenuItem>
                {skills.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant="h5">{filtered.length}</Typography>
              <Typography color="text.secondary">qualified candidates</Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      <Grid2 container spacing={2}>
        {filtered.map((application) => (
          <Grid2 key={application.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Box>
                      <Typography variant="h6">{application.candidateName}</Typography>
                      <Typography color="text.secondary">{application.jobTitle}</Typography>
                    </Box>
                    <Chip color="primary" label={`${application.matchScore}%`} />
                  </Stack>
                  <Typography>{application.summary}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {application.skills.map((item) => <Chip key={item} label={item} size="small" />)}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{application.experienceYears} years experience · {application.stage}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
