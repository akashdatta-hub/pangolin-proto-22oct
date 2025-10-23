import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { stories } from '../data/stories';
import { colors } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';

export const HomeScreen = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 100 });
  const [isHovering, setIsHovering] = useState(false);

  const storyList = Object.values(stories);

  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 100 }); // Default: bottom center
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return; // Only update position while hovering

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smoother updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
      setGradientPosition({ x, y });
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smoothly transition back to default position
    setGradientPosition({ x: 50, y: 100 });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, rgba(225, 107, 186, 0.20) 0%, rgba(254, 186, 123, 0.20) 100%)',
        px: 6,
        py: 3,
      }}
    >
      {/* White Container - Full Screen */}
      <Box
        sx={{
          bgcolor: 'white',
          minHeight: '100vh',
          px: 3,
          py: 4,
          borderRadius: 3,
        }}
      >
          {/* Header with Logo and Language Selector */}
          <Box
            sx={{
              pb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Left: Logo */}
            <Box>
              <img
                src="/assets/logo-pangolin.svg"
                alt="Pangolin"
                style={{ width: '120px', height: 'auto' }}
              />
            </Box>

            {/* Right: Language Selector */}
            <Box>
              <LanguageSelector />
            </Box>
          </Box>

        {/* Row 1: Featured Story and Badge */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, width: '100%', mb: 4 }}>
          {/* Featured Story Card */}
          <Box>
            <Card
              sx={{
                borderRadius: 3,
                mb: 3,
                cursor: 'pointer',
                overflow: 'hidden',
                height: '450px',
                position: 'relative',
              }}
              onClick={() => navigate('/story/kite-festival/page/1')}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Layer 1: Background Image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/assets/story1-page1.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 1,
                }}
              />

              {/* Layer 2: Gradient Overlay with spotlight effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(255, 244, 235, 0.15) 0%, rgba(254, 186, 123, 0.52) 36%, rgba(254, 186, 123, 0.70) 100%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle 400px at ${gradientPosition.x}% ${gradientPosition.y}%, rgba(254, 186, 123, 0.4) 0%, rgba(254, 186, 123, 0.2) 30%, transparent 60%)`,
                    opacity: isHovering ? 1 : 0,
                    transition: 'opacity 0.4s ease-out',
                  },
                }}
                style={{
                  '--spotlight-x': `${gradientPosition.x}%`,
                  '--spotlight-y': `${gradientPosition.y}%`,
                } as React.CSSProperties}
              />

              {/* Layer 3: Content */}
              <CardContent
                sx={{
                  position: 'relative',
                  zIndex: 3,
                  p: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  '&:last-child': {
                    pb: 0,
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color={colors.neutral[40]}
                    gutterBottom
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.25px',
                    }}
                  >
                    {t('story')} 1
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: typography.displayFont,
                      color: colors.primary.dark,
                      mb: 1,
                      fontSize: '52px',
                      fontWeight: 700,
                      lineHeight: '64px',
                      letterSpacing: '0px',
                    }}
                  >
                    {storyList[0].title[language]}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.neutral[30]}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {storyList[0].description[language]}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    sx={{
                      bgcolor: 'white',
                      color: colors.primary.main,
                      textTransform: 'none',
                      fontSize: '24px',
                      fontWeight: 600,
                      py: 1.5,
                      px: 2,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    }}
                  >
                    {t('startStory')}
                  </Button>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img
                        key={i}
                        src="/assets/star-outline.svg"
                        alt="Star"
                        style={{ width: '24px', height: '24px' }}
                      />
                    ))}
                  </Box>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Badge Card */}
          <Box>
            <Card
              sx={{
                bgcolor: colors.tertiary.light,
                borderRadius: 3,
                position: 'sticky',
                top: 20,
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/assets/badge-word-explorer-visual.png"
                    alt="Little Explorer Badge"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
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

        {/* Row 2: Story List (Full Width) */}
        <Box sx={{ width: '100%' }}>
          {/* Other Stories List */}
          <Stack spacing={0} divider={<Box sx={{ height: '1px', bgcolor: colors.neutral[90] }} />}>
            {storyList.slice(1).map((story, index) => (
              <Box
                key={story.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  py: 3,
                  px: 3,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: colors.neutral[95],
                  },
                }}
              >
                {/* Icon/Thumbnail */}
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    bgcolor: colors.tertiary.light,
                    borderRadius: 3,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={`/assets/story${index + 2}-cover.png`}
                    alt={story.title[language]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Story Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color={colors.neutral[40]} gutterBottom>
                    {t('story')} {index + 2}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: typography.displayFont,
                      color: colors.primary.main,
                      mb: 0.5,
                    }}
                  >
                    {story.title[language]}
                  </Typography>
                  <Typography variant="body2" color={colors.neutral[40]}>
                    {t('learningOutcome')} {story.description[language]}
                  </Typography>
                  <Typography variant="body2" color={colors.neutral[40]} sx={{ mt: 0.5 }}>
                    {t('comingSoon')}
                  </Typography>
                </Box>

                {/* Stars */}
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src="/assets/star-outline.svg"
                      alt="Star"
                      style={{ width: '32px', height: '32px' }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

// Import typography for displayFont
import { typography } from '../theme/theme';
