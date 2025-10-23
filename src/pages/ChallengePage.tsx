import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyChallenges } from '../data/challenges';
import { DrawingChallenge } from '../components/DrawingChallenge';
import { FillBlanksChallenge } from '../components/FillBlanksChallenge';
import { MatchPairsChallenge } from '../components/MatchPairsChallenge';
import { SentenceBuildingChallenge } from '../components/SentenceBuildingChallenge';
import { MCQChallenge } from '../components/MCQChallenge';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { Box, Typography } from '@mui/material';

export const ChallengePage = () => {
  const { storyId, challengeNumber } = useParams<{
    storyId: string;
    challengeNumber: string;
  }>();
  const navigate = useNavigate();
  const { recordResult, getStoryResults } = useChallengeProgress();

  const storyChallenge = storyChallenges[storyId || ''];
  const currentChallengeIndex = parseInt(challengeNumber || '1') - 1;
  const challenge = storyChallenge?.challenges[currentChallengeIndex];

  if (!storyChallenge || !challenge) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Challenge not found</Typography>
      </Box>
    );
  }

  const handleChallengeComplete = (success: boolean) => {
    // After each challenge, go to the next story page
    const nextPageNumber = currentChallengeIndex + 2; // challengeNumber is 1-indexed

    // Check if there's a next page
    const totalPages = 5; // Kite Festival has 5 pages
    if (nextPageNumber <= totalPages) {
      // Record result in context
      if (storyId) {
        recordResult(storyId, currentChallengeIndex, success);
      }
      // Go to next story page
      navigate(`/story/${storyId}/page/${nextPageNumber}`);
    } else {
      // Last challenge - record result and navigate to completion screen
      // Star calculation will happen on StoryCompletePage by reading from context
      if (storyId) {
        recordResult(storyId, currentChallengeIndex, success);
      }

      // Navigate to Story Complete screen
      // Don't pass stars in URL - let the complete page calculate from context
      navigate(`/story/${storyId}/complete`);
    }
  };

  const commonProps = {
    storyId: storyId || '',
    challengeNumber: currentChallengeIndex + 1,
    totalChallenges: storyChallenge.challenges.length,
    onComplete: handleChallengeComplete,
  };

  // Render appropriate challenge component based on type
  switch (challenge.type) {
    case 'drawing':
      return <DrawingChallenge challenge={challenge} {...commonProps} />;
    case 'fill-blanks':
      return <FillBlanksChallenge challenge={challenge} {...commonProps} />;
    case 'match-pairs':
      return <MatchPairsChallenge challenge={challenge} {...commonProps} />;
    case 'sentence-building':
      return <SentenceBuildingChallenge challenge={challenge} {...commonProps} />;
    case 'mcq':
      return <MCQChallenge challenge={challenge} {...commonProps} />;
    default:
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Unknown challenge type</Typography>
        </Box>
      );
  }
};
