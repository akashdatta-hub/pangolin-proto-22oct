import type { ReactNode } from 'react';
import { Box, Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';

interface ChallengeLayoutProps {
  children: ReactNode;
  bottomBar?: ReactNode;
}

export const ChallengeLayout = ({ children, bottomBar }: ChallengeLayoutProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FFF4EB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Outer container with 48px padding */}
      <Box sx={{ px: 6, py: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* White container */}
        <Container
          maxWidth={false}
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            p: 0,
            overflow: 'hidden',
          }}
        >
          {/* Top Bar - Close button and Language Selector */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <IconButton onClick={() => navigate('/')} size="large">
              <Close />
            </IconButton>
            <LanguageSelector />
          </Box>

          {/* Main Content Area - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>

          {/* Bottom Bar - Sticky to bottom of white container */}
          {bottomBar && (
            <Box
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'white',
                px: 3,
                py: 2,
              }}
            >
              {bottomBar}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};
