import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('recruiter@zaalima.dev');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const user = await login({ email, password });
      navigate(user.role === 'recruiter' ? '/recruiter' : '/candidate');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in.');
    }
  }

  return (
    <Box className="login-screen">
      <Box className="login-hero">
        <Stack spacing={2} maxWidth={620}>
          <Box className="hero-icon"><Sparkles size={28} /></Box>
          <Typography variant="h3" component="h1">AI-Powered Applicant Tracking System</Typography>
          <Typography color="rgba(255,255,255,.82)" fontSize={18}>
            Manage hiring from job posting to offer with ranked candidates, parsed resumes, and interview-ready workflows.
          </Typography>
        </Stack>
      </Box>
      <Card className="login-card">
        <CardContent>
          <Stack spacing={2.25} component="form" onSubmit={handleSubmit}>
            <Stack spacing={0.5}>
              <Typography variant="h5">Sign in</Typography>
              <Typography color="text.secondary">Recruiter and candidate demo accounts are ready.</Typography>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" startIcon={<LockKeyhole size={18} />}>Sign in</Button>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">Candidate: candidate@zaalima.dev</Typography>
              <Typography variant="body2" color="text.secondary">Password: Password@123</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
