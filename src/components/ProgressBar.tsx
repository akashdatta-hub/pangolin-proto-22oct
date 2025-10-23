import { Box } from '@mui/material';
import { colors } from '../theme/theme';

interface ProgressBarProps {
  currentPosition: number; // 1-indexed position (1-10 for 5 pages + 5 challenges)
  totalPositions: number; // Total positions (10 for 5 pages + 5 challenges)
  challengeResults?: boolean[]; // Array of challenge pass/fail results (true = passed, false = failed/skipped)
}

export const ProgressBar = ({ currentPosition, totalPositions, challengeResults = [] }: ProgressBarProps) => {
  const items = [];

  // Calculate number of segments (half of total positions since we have page+challenge pairs)
  const segments = totalPositions / 2;

  for (let i = 1; i <= segments; i++) {
    // Each segment represents a page+challenge pair
    // Position calculation: page is at (i*2-1), challenge is at (i*2)
    const pagePosition = i * 2 - 1;
    const challengePosition = i * 2;

    // Determine bar state based on current position
    const isPageCompleted = currentPosition > pagePosition;
    const isPageCurrent = currentPosition === pagePosition;
    const isChallengeCompleted = currentPosition > challengePosition;
    const isChallengeCurrent = currentPosition === challengePosition;

    // Segment is completed if we've passed both page and challenge
    const isSegmentCompleted = currentPosition > challengePosition;
    const isSegmentCurrent = currentPosition === pagePosition || currentPosition === challengePosition;

    if (isSegmentCurrent) {
      // Current position: wavy purple line
      items.push(
        <Box
          key={`bar-${i}`}
          sx={{
            width: 120,
            height: 8,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 1,
          }}
        >
          <svg
            width="120"
            height="12"
            viewBox="-4 0 128 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '8px' }}
          >
            <path
              d="M0 6 Q 5 3, 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6 T 110 6 T 120 6"
              stroke={colors.primary.main}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </Box>
      );
    } else {
      // Completed or future: straight bar
      items.push(
        <Box
          key={`bar-${i}`}
          sx={{
            width: 120,
            height: 8,
            bgcolor: isSegmentCompleted ? colors.primary.main : '#FFF4EB',
            borderRadius: 1,
          }}
        />
      );
    }

    // Add star after each bar (one star per challenge)
    // Star is filled only if the challenge was actually passed (not just completed)
    // challengeResults[i-1] because challenges are 0-indexed, but segments are 1-indexed
    const challengeIndex = i - 1;
    const isStarFilled = challengeResults[challengeIndex] === true;

    items.push(
      <Box
        key={`star-${i}`}
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={isStarFilled ? '/assets/star-filled.svg' : '/assets/star-outline.svg'}
          alt={isStarFilled ? 'Completed' : 'Upcoming'}
          style={{
            width: '32px',
            height: '32px',
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {items}
    </Box>
  );
};
