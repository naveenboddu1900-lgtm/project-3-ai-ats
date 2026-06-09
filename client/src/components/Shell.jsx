import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Columns3, LogOut, Sparkles, Trophy, UserRound } from 'lucide-react';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

const recruiterLinks = [
  { to: '/recruiter', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/pipeline', label: 'Pipeline', icon: Columns3 },
  { to: '/ranking', label: 'Ranking', icon: Trophy }
];

export default function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'recruiter' ? recruiterLinks : [{ to: '/candidate', label: 'Portal', icon: UserRound }];

  return (
    <Box minHeight="100vh">
      <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={1.25} flexGrow={1}>
            <Box className="brand-mark"><Sparkles size={20} /></Box>
            <Box>
              <Typography variant="h6" lineHeight={1}>Zaalima ATS</Typography>
              <Typography variant="caption" color="text.secondary">Project 3 recruitment platform</Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  startIcon={<Icon size={18} />}
                  className="nav-button"
                >
                  {link.label}
                </Button>
              );
            })}
            <Button
              color="inherit"
              startIcon={<LogOut size={18} />}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
