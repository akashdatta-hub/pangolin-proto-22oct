// Voice configuration rules for different contexts and languages

export type SpeechContext =
  | 'story-word'           // Individual word clicks in story
  | 'story-sentence'       // Sentence audio in story
  | 'challenge-correct'    // Correct answer feedback
  | 'challenge-incorrect'  // Incorrect answer feedback
  | 'challenge-hint'       // Hint modal
  | 'vocabulary-word'      // Vocabulary test words
  | 'completion'           // Completion/celebration messages
  | 'default';             // Default fallback

export interface VoiceSettings {
  rate: number;    // Speed: 0.1 to 10 (1 = normal)
  pitch: number;   // Pitch: 0 to 2 (1 = normal)
  volume: number;  // Volume: 0 to 1 (1 = full volume)
}

export interface LanguageVoiceConfig {
  preferredVoices: string[];  // List of preferred voice names/codes
  rate: number;               // Default rate for this language
}

// Voice settings per context
export const contextSettings: Record<SpeechContext, VoiceSettings> = {
  'story-word': {
    rate: 0.8,      // Slower for learning individual words
    pitch: 1.0,
    volume: 1.0,
  },
  'story-sentence': {
    rate: 0.9,      // Slightly slower for comprehension
    pitch: 1.0,
    volume: 1.0,
  },
  'challenge-correct': {
    rate: 1.0,      // Normal speed
    pitch: 1.1,     // Slightly higher pitch for positive feedback
    volume: 1.0,
  },
  'challenge-incorrect': {
    rate: 0.95,     // Slightly slower for clarity
    pitch: 0.95,    // Slightly lower pitch
    volume: 1.0,
  },
  'challenge-hint': {
    rate: 0.85,     // Slower for hints/help
    pitch: 1.0,
    volume: 1.0,
  },
  'vocabulary-word': {
    rate: 0.8,      // Slower for vocabulary practice
    pitch: 1.0,
    volume: 1.0,
  },
  'completion': {
    rate: 1.0,      // Normal speed for celebration
    pitch: 1.1,     // Higher pitch for excitement
    volume: 1.0,
  },
  'default': {
    rate: 0.9,      // Default slightly slower for learning context
    pitch: 1.0,
    volume: 1.0,
  },
};

// Language-specific voice preferences
// Priority: Indian voices, with male voices for English, female voices for Telugu/Hindi
export const languageVoiceConfig: Record<string, LanguageVoiceConfig> = {
  en: {
    preferredVoices: [
      // Indian English male voices (PRIORITY)
      'Rishi',                     // macOS Indian English male
      'Google Indian English Male',
      'Microsoft Ravi',            // Windows Indian English male
      'en-IN Male',
      // Standard Indian English (any gender)
      'Google Indian English',
      'en-IN',
      // Fallback to standard English voices
      'Daniel',                    // macOS British male
      'Google US English Male',
      'Microsoft David',           // Windows male
      'en-US',
      'en-GB',
    ],
    rate: 0.9,
  },
  te: {
    preferredVoices: [
      // Telugu female voices (PRIORITY)
      'Google తెలుగు Female',
      'te-IN Female',
      'Microsoft Heera',           // Windows Telugu female
      // Fallback to any Telugu voice
      'Google తెలుగు',
      'te-IN',
    ],
    rate: 0.85,  // Slightly slower for non-English
  },
  hi: {
    preferredVoices: [
      // Hindi female voices (PRIORITY)
      'Google हिन्दी Female',
      'hi-IN Female',
      'Lekha',                     // macOS Hindi female
      'Microsoft Kalpana',         // Windows Hindi female
      // Fallback to any Hindi voice
      'Google हिन्दी',
      'hi-IN',
    ],
    rate: 0.85,  // Slightly slower for non-English
  },
};

// Get voice settings for a specific context and language
export const getVoiceSettings = (
  context: SpeechContext = 'default',
  language: string = 'en'
): VoiceSettings & { language: string } => {
  const contextSetting = contextSettings[context] || contextSettings.default;
  const langConfig = languageVoiceConfig[language] || languageVoiceConfig.en;

  return {
    ...contextSetting,
    // Override rate with language-specific rate if needed for learning
    rate: context.includes('word') ? langConfig.rate : contextSetting.rate,
    language,
  };
};

// Find the best available voice for a language
export const findBestVoice = (language: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const langConfig = languageVoiceConfig[language] || languageVoiceConfig.en;

  console.log(`🔍 Finding voice for language: ${language}`);
  console.log(`📋 Available voices (${voices.length}):`, voices.map(v => `${v.name} (${v.lang})`));
  console.log(`🎯 Looking for preferred voices:`, langConfig.preferredVoices);

  // Try each preferred voice in order
  for (const preferredVoice of langConfig.preferredVoices) {
    // Exact name match
    const exactMatch = voices.find(v => v.name === preferredVoice);
    if (exactMatch) {
      console.log(`✅ Found exact name match: ${exactMatch.name} (${exactMatch.lang})`);
      return exactMatch;
    }

    // Lang code match (e.g., "en-US")
    const langMatch = voices.find(v => v.lang === preferredVoice);
    if (langMatch) {
      console.log(`✅ Found lang code match: ${langMatch.name} (${langMatch.lang})`);
      return langMatch;
    }

    // Partial match (e.g., voice.lang starts with "en")
    const partialMatch = voices.find(v =>
      v.lang.startsWith(preferredVoice.split('-')[0]) ||
      v.name.toLowerCase().includes(preferredVoice.toLowerCase())
    );
    if (partialMatch) {
      console.log(`✅ Found partial match: ${partialMatch.name} (${partialMatch.lang})`);
      return partialMatch;
    }
  }

  // Fallback: find any voice that matches the language code
  const fallback = voices.find(v => v.lang.startsWith(language));
  if (fallback) {
    console.log(`⚠️ Using fallback voice: ${fallback.name} (${fallback.lang})`);
  } else {
    console.error(`❌ No voice found for language: ${language}`);
    console.log(`Available languages:`, [...new Set(voices.map(v => v.lang))]);
  }
  return fallback || null;
};
