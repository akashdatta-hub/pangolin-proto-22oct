import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { colors } from '../theme/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Typography variant="h3" color={colors.error.main} gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color={colors.neutral[40]} paragraph>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 2,
                p: 2,
                bgcolor: colors.error.light,
                borderRadius: 2,
                overflow: 'auto',
                maxWidth: '100%',
                textAlign: 'left',
              }}
            >
              {this.state.error?.stack}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 3 }}
            >
              Reload Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
