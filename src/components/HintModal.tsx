import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography } from '../theme/theme';
import { challengeLabels } from '../data/challenges';

interface HintModalProps {
  open: boolean;
  onClose: () => void;
  hint: {
    question: { en: string; te: string; hi: string };
    jumbledLetters: string;
    answer: string;
  };
  onSuccess: () => void;
}

export const HintModal = ({ open, onClose, hint, onSuccess }: HintModalProps) => {
  const { language } = useLanguage();
  const [hintAnswer, setHintAnswer] = useState('');

  // Text-to-Speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', te: 'te-IN', hi: 'hi-IN' };
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const cleanAnswer = hintAnswer.trim().toLowerCase();
    if (cleanAnswer === hint.answer.toLowerCase()) {
      setHintAnswer('');
      onSuccess();
      onClose();
    } else {
      speak(challengeLabels[language].incorrect);
    }
  };

  const handleClose = () => {
    setHintAnswer('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          minWidth: 400,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: typography.displayFont }}>
            {challengeLabels[language].hint}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {hint.question[language]}
        </Typography>

        <Box
          sx={{
            bgcolor: colors.tertiary.light,
            p: 2,
            borderRadius: 2,
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: typography.displayFont, letterSpacing: 4 }}
          >
            {hint.jumbledLetters}
          </Typography>
        </Box>

        <TextField
          value={hintAnswer}
          onChange={(e) => setHintAnswer(e.target.value)}
          placeholder={challengeLabels[language].typeHere}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            bgcolor: colors.primary.main,
            color: 'white',
            textTransform: 'none',
            '&:hover': { bgcolor: colors.primary.dark },
          }}
        >
          {challengeLabels[language].submit}
        </Button>
      </Box>
    </Modal>
  );
};
