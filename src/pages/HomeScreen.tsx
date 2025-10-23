import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Tooltip,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { stories } from '../data/stories';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';

export const HomeScreen = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { resetAllProgress } = useChallengeProgress();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 100 });
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const storyList = Object.values(stories);

  // Reset all progress when returning to home screen
  useEffect(() => {
    resetAllProgress();
  }, []);

  // Check if image is already loaded or wait for load event
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        setImageLoaded(true);
      } else {
        const handleLoad = () => setImageLoaded(true);
        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 100 }); // Default: bottom center
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return; // Only update position while hovering

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Store values before requestAnimationFrame
    const target = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Use requestAnimationFrame for smoother updates
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

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
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  zIndex: 1,
                }}
              >
                <img
                  ref={imgRef}
                  src="/assets/story1-page1.jpg"
                  alt="Story background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

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
                      bgcolor: '#743799',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontSize: '24px',
                      fontWeight: 600,
                      py: 1.5,
                      px: 2,
                      borderRadius: '100px',
                      '&:hover': { bgcolor: '#5c2c7a' },
                    }}
                  >
                    {t('startStory')}
                  </Button>

                  {/* Stars with Tooltip and Animation */}
                  <Tooltip
                    title={t('starsTooltip')}
                    placement="top"
                    arrow
                    disableTouchListener
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: colors.neutral[20],
                          color: 'white',
                          fontSize: '0.875rem',
                          fontFamily: typography.fontFamily,
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          maxWidth: 250,
                          boxShadow: 3,
                          '& .MuiTooltip-arrow': {
                            color: colors.neutral[20],
                          },
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((i) => {
                        // Calculate normalized x position (0 to 1) for constellation sweep
                        const normalizedX = (i - 1) / 4; // 0, 0.25, 0.5, 0.75, 1

                        return (
                          <Box
                            key={i}
                            sx={{
                              opacity: 0,
                              animation: imageLoaded ? 'fadeIn 200ms ease-in forwards' : 'none',
                              animationDelay: imageLoaded ? `calc(${normalizedX} * 0.02s + ${i - 1} * 0.08s)` : '0s',
                              '@keyframes fadeIn': {
                                from: {
                                  opacity: 0,
                                  transform: 'scale(0.8)',
                                },
                                to: {
                                  opacity: 1,
                                  transform: 'scale(1)',
                                },
                              },
                            }}
                          >
                            <img
                              src="/assets/star-outline.svg"
                              alt="Star"
                              style={{ width: '48px', height: '48px', display: 'block' }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Tooltip>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Badge Card */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'start' }}>
            <Box
              sx={{
                bgcolor: colors.tertiary.light,
                borderRadius: 3,
                px: 3,
                py: 2,
                textAlign: 'center',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: colors.primary.dark,
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                {t('collectThisBadge')}
              </Typography>

              <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider', mb: 2 }} />

              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                }}
              >
                <img
                  src="/assets/badge-word-explorer-visual.png"
                  alt="Word explorer badge"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontFamily: typography.displayFont,
                  color: colors.primary.dark,
                }}
              >
                {t('wordExplorer')}
              </Typography>
            </Box>
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
