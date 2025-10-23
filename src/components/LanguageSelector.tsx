import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

const languageNames: Record<Language, string> = {
  en: 'English',
  te: 'తెలుగు',
  hi: 'हिंदी',
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: 'white',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
        }}
      >
        <LanguageIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <MenuItem
            key={lang}
            selected={lang === language}
            onClick={() => handleLanguageSelect(lang)}
          >
            {languageNames[lang]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
