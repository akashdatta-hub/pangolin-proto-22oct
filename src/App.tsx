import { Box, Typography, Button, Container } from '@mui/material';
import { colors } from './theme/theme';

function App() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: colors.background.default,
          py: 4,
        }}
      >
        {/* Header */}
        <Typography variant="h1" color={colors.primary.dark} gutterBottom>
          Pangolin
        </Typography>

        <Typography variant="h4" color={colors.tertiary.dark} gutterBottom>
          English Vocabulary Game
        </Typography>

        <Typography variant="body1" paragraph>
          Design system initialized successfully!
        </Typography>

        {/* Color Palette Demo */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Color Palette</Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ width: 150, height: 100, bgcolor: colors.primary.main, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Typography variant="caption">Primary</Typography>
            </Box>
            <Box sx={{ width: 150, height: 100, bgcolor: colors.secondary.main, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Typography variant="caption">Secondary</Typography>
            </Box>
            <Box sx={{ width: 150, height: 100, bgcolor: colors.tertiary.main, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary.dark }}>
              <Typography variant="caption">Tertiary</Typography>
            </Box>
            <Box sx={{ width: 150, height: 100, bgcolor: colors.success.light, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.success.main }}>
              <Typography variant="caption">Success</Typography>
            </Box>
            <Box sx={{ width: 150, height: 100, bgcolor: colors.error.light, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.error.main }}>
              <Typography variant="caption">Error</Typography>
            </Box>
          </Box>
        </Box>

        {/* Typography Demo */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Typography Scale</Typography>

          <Typography variant="h2" gutterBottom>Display Large (Leckerli One)</Typography>
          <Typography variant="h4" gutterBottom>Headline Large (Leckerli One)</Typography>
          <Typography variant="subtitle1" gutterBottom>Title Large (Open Sans)</Typography>
          <Typography variant="body1" gutterBottom>Body Large (Open Sans) - Regular paragraph text</Typography>
          <Typography variant="body2" gutterBottom>Body Medium (Open Sans) - Smaller text</Typography>
          <Typography variant="caption" display="block">Caption (Open Sans) - Small labels</Typography>
        </Box>

        {/* Button Demo */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">Primary Button</Button>
          <Button variant="outlined" color="primary">Secondary Button</Button>
          <Button variant="contained" color="success">Success Button</Button>
          <Button variant="contained" color="error">Error Button</Button>
          <Button variant="text">Text Button</Button>
        </Box>

        <Box sx={{ mt: 4, p: 3, bgcolor: colors.success.light, borderRadius: 2 }}>
          <Typography variant="body1" color={colors.success.main}>
            ✓ Phase 1 Foundation Complete! Design system initialized with all colors and typography from Figma.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
