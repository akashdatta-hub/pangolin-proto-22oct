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
  const { recordResult, getStoryResults, getFailedChallenges } = useChallengeProgress();

  // Check if this is a revisit (URL will contain ?revisit=true)
  const searchParams = new URLSearchParams(window.location.search);
  const isRevisit = searchParams.get('revisit') === 'true';

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
    // Record result in context
    if (storyId) {
      console.log(`📝 Recording result: storyId=${storyId}, challenge=${currentChallengeIndex}, success=${success}, isRevisit=${isRevisit}`);
      recordResult(storyId, currentChallengeIndex, success);
    }

    // If this is a revisit, handle differently
    if (isRevisit) {
      // Get remaining failed challenges
      const remainingFailed = getFailedChallenges(storyId || '').filter(
        (idx) => idx !== currentChallengeIndex
      );

      if (remainingFailed.length > 0) {
        // Navigate to next failed challenge
        const nextFailedIndex = remainingFailed[0];
        navigate(`/story/${storyId}/challenge/${nextFailedIndex + 1}?revisit=true`);
      } else {
        // No more revisits, go to complete screen
        navigate(`/story/${storyId}/complete`);
      }
      return;
    }

    // Normal flow (not a revisit)
    const nextPageNumber = currentChallengeIndex + 2; // challengeNumber is 1-indexed
    const totalPages = 5; // Kite Festival has 5 pages

    if (nextPageNumber <= totalPages) {
      // Go to next story page
      navigate(`/story/${storyId}/page/${nextPageNumber}`);
    } else {
      // Last challenge (challenge 5) completed
      // Check if there are any failed challenges that need revisiting
      const failedChallenges = getFailedChallenges(storyId || '');

      if (failedChallenges.length > 0) {
        // Navigate to first failed challenge for revisit
        const firstFailedIndex = failedChallenges[0];
        console.log(`🔄 Revisiting failed challenge ${firstFailedIndex + 1}`);
        navigate(`/story/${storyId}/challenge/${firstFailedIndex + 1}?revisit=true`);
      } else {
        // No failed challenges, go straight to complete screen
        console.log(`📊 All results after final challenge:`, getStoryResults(storyId || ''));
        navigate(`/story/${storyId}/complete`);
      }
    }
  };

  const commonProps = {
    storyId: storyId || '',
    challengeNumber: currentChallengeIndex + 1,
    totalChallenges: storyChallenge.challenges.length,
    onComplete: handleChallengeComplete,
    isRevisit,
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
