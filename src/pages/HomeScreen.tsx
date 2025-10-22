import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import { PlayArrow, Star, StarBorder } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { stories } from '../data/stories';
import { colors } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';

export const HomeScreen = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');

  const storyList = Object.values(stories);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.background.default,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Language Selector */}
        <Box
          sx={{
            pt: 2,
            pb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Button
              startIcon={<Star />}
              sx={{
                color: colors.secondary.main,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {t('stories')}
            </Button>
            <Button
              sx={{
                color: colors.neutral[40],
                textTransform: 'none',
              }}
            >
              {t('collection')}
            </Button>
          </Box>
          <LanguageSelector />
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
          {/* Left Column - Stories */}
          <Box>
            {/* Featured Story Card */}
            <Card
              sx={{
                background: `linear-gradient(135deg, ${colors.tertiary.light} 0%, ${colors.tertiary.main}30 100%)`,
                borderRadius: 3,
                mb: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate('/story/kite-festival/page/1')}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="caption" color={colors.neutral[40]} gutterBottom>
                  Story 1
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: typography.displayFont,
                    color: colors.primary.dark,
                    mb: 1,
                  }}
                >
                  {storyList[0].title}
                </Typography>
                <Typography variant="body2" color={colors.neutral[30]} paragraph>
                  {storyList[0].description}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      sx={{
                        bgcolor: 'white',
                        color: colors.primary.main,
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                      }}
                    >
                      {t('read')}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Star />}
                      sx={{
                        borderColor: 'white',
                        color: colors.primary.main,
                        bgcolor: 'white',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      {t('practice')}
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarBorder key={i} sx={{ color: colors.primary.main }} />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Toggle Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, value) => value && setFilter(value)}
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 3,
                    borderRadius: 3,
                    border: 'none',
                  },
                  '& .Mui-selected': {
                    bgcolor: `${colors.secondary.main} !important`,
                    color: 'white !important',
                  },
                }}
              >
                <ToggleButton value="upcoming">{t('upcoming')}</ToggleButton>
                <ToggleButton value="completed">{t('completed')}</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Other Stories */}
            <Stack spacing={2}>
              {storyList.slice(1).map((story, index) => (
                <Card
                  key={story.id}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: colors.tertiary.light,
                        borderRadius: 2,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color={colors.neutral[40]}>
                        Story {index + 2}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: typography.displayFont,
                          color: colors.primary.main,
                        }}
                      >
                        {story.title}
                      </Typography>
                      <Typography variant="caption" color={colors.neutral[40]}>
                        {t('learningOutcome')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarBorder key={i} sx={{ fontSize: 20, color: colors.secondary.main }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Right Column - Badge Card */}
          <Box>
            <Card
              sx={{
                bgcolor: colors.tertiary.light,
                borderRadius: 3,
                position: 'sticky',
                top: 20,
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1" sx={{ opacity: 0.3 }}>
                    ?
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: typography.displayFont,
                    color: colors.primary.dark,
                    mb: 1,
                  }}
                >
                  {t('littleExplorer')}
                </Typography>
                <Typography variant="body2" color={colors.neutral[30]}>
                  {t('littleExplorerDesc')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Import typography for displayFont
import { typography } from '../theme/theme';
