// Challenge content for all stories
// Supports multi-language (English, Telugu, Hindi)

export type ChallengeType = 'drawing' | 'fill-blanks' | 'match-pairs' | 'sentence-building' | 'mcq';

// Hint Types
export type HintImageUnscramble = {
  type: 'image-unscramble';
  question: { en: string; te: string; hi: string };
  imagePath: string;
  jumbledLetters: string;
  answer: string;
};

export type HintImageQuestion = {
  type: 'image-question';
  question: { en: string; te: string; hi: string };
  imagePath: string;
  imageAspectRatio?: string; // e.g., '4/3'
};

export type HintRiddle = {
  type: 'riddle';
  question: { en: string; te: string; hi: string };
  answer: string | string[]; // Can be single word or multiple words
  options?: string[]; // Optional word options to click
};

export type HintWordBubbles = {
  type: 'word-bubbles';
  question: { en: string; te: string; hi: string };
  words: string[]; // English words to display
};

export type HintTranslation = {
  type: 'translation';
  question: { en: string; te: string; hi: string };
  sentence: { te: string; hi: string };
  targetLanguage: 'en';
};

export type Hint = HintImageUnscramble | HintImageQuestion | HintRiddle | HintWordBubbles | HintTranslation;

export interface DrawingChallenge {
  type: 'drawing';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  correctAnswers: string[]; // Preset correct answers
  goalWords: string[]; // Words the student should learn from this challenge
  hint: Hint;
}

export interface FillBlanksChallenge {
  type: 'fill-blanks';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  sentence: string; // Sentence with {blank} placeholders (can have multiple)
  correctAnswer: string | string[]; // Single answer or array for multiple blanks
  suggestedWords: string[]; // Word options including correct answers
  goalWords: string[]; // Words the student should learn from this challenge
  hint: Hint;
}

export interface MatchPairsChallenge {
  type: 'match-pairs';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  pairs: Array<{
    english: string;
    translation: string;
  }>;
  goalWords: string[]; // Words the student should learn from this challenge
  hint: Hint;
}

export interface SentenceBuildingChallenge {
  type: 'sentence-building';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  words: string[]; // Words to arrange
  correctSentence: string;
  goalWords: string[]; // Words the student should learn from this challenge
  hint: Hint;
}

export interface MCQChallenge {
  type: 'mcq';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  options: string[]; // 3 options
  correctAnswer: string;
  goalWords: string[]; // Words the student should learn from this challenge
  hint: Hint;
}

export type Challenge =
  | DrawingChallenge
  | FillBlanksChallenge
  | MatchPairsChallenge
  | SentenceBuildingChallenge
  | MCQChallenge;

export interface StoryChallenge {
  storyId: string;
  challenges: Challenge[];
}

// Vocabulary Test Questions (final 3 questions after story completion)
export interface VocabularyTestQuestion {
  targetWord: string; // The Telugu/Hindi word to be tested
  options: string[]; // English word options
  correctAnswer: string; // The correct English word
}

export const vocabularyTestQuestions: VocabularyTestQuestion[] = [
  {
    targetWord: 'ఆకాశం', // sky in Telugu
    options: ['sky', 'tree', 'wind'],
    correctAnswer: 'sky',
  },
  {
    targetWord: 'స్నేహితులు', // friends in Telugu
    options: ['friends', 'children', 'adults'],
    correctAnswer: 'friends',
  },
  {
    targetWord: 'పతంగం', // kite in Telugu
    options: ['kite', 'bird', 'plane'],
    correctAnswer: 'kite',
  },
];

// Challenge data for Kite Festival story
export const storyChallenges: Record<string, StoryChallenge> = {
  'kite-festival': {
    storyId: 'kite-festival',
    challenges: [
      // Challenge 1: Drawing
      {
        type: 'drawing',
        question: {
          en: 'Draw 3 things that fly in the sky',
          te: 'ఆకాశంలో ఎగిరే 3 విషయాలను గీయండి',
          hi: 'आकाश में उड़ने वाली 3 चीजें बनाएं',
        },
        correctAnswers: ['kite', 'bird', 'plane'],
        goalWords: ['kite', 'bird', 'plane'], // Goal: learn 3 words for things that fly
        hint: {
          type: 'image-unscramble',
          question: {
            en: 'Look at this picture and unscramble the letters to spell what you see!',
            te: 'ఈ చిత్రాన్ని చూడండి మరియు అక్షరాలను సరైన క్రమంలో పెట్టి ఇది ఏమిటో చెప్పండి!',
            hi: 'इस तस्वीर को देखो और अक्षरों को सही क्रम में लगाकर बताओ यह क्या है!',
          },
          imagePath: '/assets/story1-challenge2/story1-challenge2-kiteimage.png',
          jumbledLetters: 'TIEK',
          answer: 'kite',
        },
      },
      // Challenge 2: Fill in the Blanks
      {
        type: 'fill-blanks',
        question: {
          en: 'Complete the sentence',
          te: 'వాక్యాన్ని పూర్తి చేయండి',
          hi: 'वाक्य पूरा करें',
        },
        sentence: 'The kite lifted into the {blank} and began to dance with the {blank}.',
        correctAnswer: ['air', 'wind'],
        suggestedWords: ['air', 'wind', 'ground', 'tree', 'house'],
        goalWords: ['air', 'wind'], // Goal: learn words related to where kites fly
        hint: {
          type: 'riddle',
          question: {
            en: 'Two invisible friends help the kite fly. They help birds fly and clouds float too. Can you guess their names?',
            te: 'రెండు కనిపించని స్నేహితులు పతంగాన్ని ఎగరడానికి సహాయం చేస్తాయి. అవి పక్షులు ఎగరడానికి మరియు మేఘాలు తేలడానికి కూడా సహాయం చేస్తాయి. వాటి పేర్లు ఏమిటో ఊహించగలవా?',
            hi: 'दो अनदेखे दोस्त पतंग को उड़ने में मदद करते हैं। वे पक्षियों को उड़ने और बादलों को तैरने में भी मदद करते हैं। क्या तुम उनके नाम बता सकते हो?',
          },
          answer: ['air', 'wind'],
          options: ['air', 'wind', 'tree'],
        },
      },
      // Challenge 3: Match the Pairs
      {
        type: 'match-pairs',
        question: {
          en: 'Match the English words with their translations',
          te: 'ఇంగ్లీష్ పదాలను వాటి అనువాదాలతో జతపరచండి',
          hi: 'अंग्रेजी शब्दों को उनके अनुवादों से मिलाएं',
        },
        pairs: [
          { english: 'kite', translation: 'పతంగం' },
          { english: 'sky', translation: 'ఆకాశం' },
          { english: 'wind', translation: 'గాలి' },
          { english: 'tree', translation: 'చెట్టు' },
        ],
        goalWords: ['sky', 'tree'], // Goal: learn new words (kite & wind already learned in previous challenges)
        hint: {
          type: 'word-bubbles',
          question: {
            en: 'Click on the words to hear them in English and Hindi!',
            te: 'పదాలపై క్లిక్ చేయండి వాటిని ఇంగ్లీష్ మరియు హిందీలో వినడానికి!',
            hi: 'शब्दों पर क्लिक करो उन्हें अंग्रेजी और हिंदी में सुनने के लिए!',
          },
          words: ['kite', 'sky', 'wind', 'tree'],
        },
      },
      // Challenge 4: Sentence Building
      {
        type: 'sentence-building',
        question: {
          en: 'Arrange the words to make a sentence',
          te: 'వాక్యం తయారు చేయడానికి పదాలను అమర్చండి',
          hi: 'वाक्य बनाने के लिए शब्दों को व्यवस्थित करें',
        },
        words: ['Pangolin', 'held', 'the', 'spool', 'tight', 'and', 'cheered', 'them', 'on'],
        correctSentence: 'Pangolin held the spool tight and cheered them on',
        goalWords: ['held', 'spool', 'tight'], // Goal: learn action words and kite-flying related vocabulary
        hint: {
          type: 'translation',
          question: {
            en: 'Can you translate this sentence into English?',
            te: 'మీరు ఈ వాక్యాన్ని ఇంగ్లీష్‌లోకి అనువదించగలరా?',
            hi: 'क्या तुम इस वाक्य को अंग्रेजी में बता सकते हो?',
          },
          sentence: {
            te: 'పాంగొలిన్ స్పూల్‌ను గట్టిగా పట్టుకొని వారిని ఉత్సాహపరిచాడు',
            hi: 'पैंगोलिन ने धागे की रील को कसकर पकड़ा और उनकी हौसला बढ़ाई',
          },
          targetLanguage: 'en',
        },
      },
      // Challenge 5: MCQ
      {
        type: 'mcq',
        question: {
          en: 'What color was the sky in the story?',
          te: 'కథలో ఆకాశం ఏ రంగులో ఉంది?',
          hi: 'कहानी में आकाश किस रंग का था?',
        },
        options: ['blue', 'red', 'green'],
        correctAnswer: 'blue',
        goalWords: ['blue'], // Goal: learn color word
        hint: {
          type: 'image-question',
          question: {
            en: 'What colour is the sky in the picture?',
            te: 'చిత్రంలో ఆకాశం ఏ రంగులో ఉంది?',
            hi: 'तस्वीर में आकाश किस रंग का है?',
          },
          imagePath: '/assets/story1-page2.jpg',
          imageAspectRatio: '4/3',
        },
      },
    ],
  },
};

// UI labels for challenge screens
export const challengeLabels = {
  en: {
    // Common
    submit: 'Submit',
    tryAgain: 'Try Again',
    continue: 'Continue',
    hint: 'Hint',
    close: 'Close',

    // UI Display Labels (not for speech)
    correct: 'Correct!',
    incorrect: 'Incorrect',
    matched: 'Matched!',

    // Drawing Challenge
    drawingInstruction: 'Use the tools below to draw your answer',
    drawingPlaceholder: 'Draw here',
    colorPalette: 'Colors',
    delete: 'Delete',

    // Fill in Blanks
    fillBlanksInstruction: 'Type the missing word or select from suggestions',
    typeHere: 'Type here...',

    // Match Pairs
    matchPairsInstruction: 'Click pairs to match English words with translations',

    // Sentence Building
    sentenceBuildingInstruction: 'Drag the words to build the correct sentence',
    yourAnswer: 'Your answer:',

    // MCQ
    mcqInstruction: 'Select the correct answer',
  },
  te: {
    // Common
    submit: 'సమర్పించండి',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    continue: 'కొనసాగించండి',
    hint: 'సూచన',
    close: 'మూసివేయండి',

    // UI Display Labels (not for speech)
    correct: 'సరైనది!',
    incorrect: 'తప్పు',
    matched: 'సరిపోలింది!',

    // Drawing Challenge
    drawingInstruction: 'మీ సమాధానాన్ని గీయడానికి దిగువ సాధనాలను ఉపయోగించండి',
    drawingPlaceholder: 'ఇక్కడ గీయండి',
    colorPalette: 'రంగులు',
    delete: 'తొలగించు',

    // Fill in Blanks
    fillBlanksInstruction: 'తప్పిపోయిన పదాన్ని టైప్ చేయండి లేదా సూచనల నుండి ఎంచుకోండి',
    typeHere: 'ఇక్కడ టైప్ చేయండి...',

    // Match Pairs
    matchPairsInstruction: 'ఆంగ్ల పదాలను అనువాదాలతో సరిపోల్చడానికి జతలను క్లిక్ చేయండి',

    // Sentence Building
    sentenceBuildingInstruction: 'సరైన వాక్యాన్ని రూపొందించడానికి పదాలను లాగండి',
    yourAnswer: 'మీ సమాధానం:',

    // MCQ
    mcqInstruction: 'సరైన సమాధానాన్ని ఎంచుకోండి',
  },
  hi: {
    // Common
    submit: 'सबमिट करें',
    tryAgain: 'फिर से कोशिश करो',
    continue: 'आगे बढ़ो',
    hint: 'हिंट',
    close: 'बंद करो',

    // UI Display Labels (not for speech)
    correct: 'सही!',
    incorrect: 'गलत',
    matched: 'मिल गया!',

    // Drawing Challenge
    drawingInstruction: 'अपना जवाब बनाने के लिए नीचे दिए गए टूल्स का इस्तेमाल करो',
    drawingPlaceholder: 'यहाँ बनाओ',
    colorPalette: 'रंग',
    delete: 'मिटाओ',

    // Fill in Blanks
    fillBlanksInstruction: 'खाली शब्द टाइप करो या सुझावों में से चुनो',
    typeHere: 'यहाँ टाइप करो...',

    // Match Pairs
    matchPairsInstruction: 'अंग्रेजी शब्दों को हिंदी से मिलाने के लिए जोड़े पर क्लिक करो',

    // Sentence Building
    sentenceBuildingInstruction: 'सही वाक्य बनाने के लिए शब्दों को खींचो',
    yourAnswer: 'आपका जवाब:',

    // MCQ
    mcqInstruction: 'सही जवाब चुनो',
  },
};
