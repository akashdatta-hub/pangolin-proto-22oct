// Challenge content for all stories
// Supports multi-language (English, Telugu, Hindi)

export type ChallengeType = 'drawing' | 'fill-blanks' | 'match-pairs' | 'sentence-building' | 'mcq';

export interface DrawingChallenge {
  type: 'drawing';
  question: {
    en: string;
    te: string;
    hi: string;
  };
  correctAnswers: string[]; // Preset correct answers
  goalWords: string[]; // Words the student should learn from this challenge
  hint: {
    question: {
      en: string;
      te: string;
      hi: string;
    };
    jumbledLetters: string;
    answer: string;
  };
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
  hint: {
    question: {
      en: string;
      te: string;
      hi: string;
    };
    jumbledLetters: string;
    answer: string;
  };
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
  hint: {
    question: {
      en: string;
      te: string;
      hi: string;
    };
    jumbledLetters: string;
    answer: string;
  };
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
  hint: {
    question: {
      en: string;
      te: string;
      hi: string;
    };
    jumbledLetters: string;
    answer: string;
  };
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
  hint: {
    question: {
      en: string;
      te: string;
      hi: string;
    };
    jumbledLetters: string;
    answer: string;
  };
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
          question: {
            en: 'Unscramble: What were the friends flying in the story?',
            te: 'అక్షరాలను క్రమంలో పెట్టండి: కథలో స్నేహితులు ఏమి ఎగురవేసారు?',
            hi: 'अक्षरों को सही क्रम में लगाएं: कहानी में दोस्त क्या उड़ा रहे थे?',
          },
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
          question: {
            en: 'Unscramble: What did the kite lift into?',
            te: 'అక్షరాలను క్రమంలో పెట్టండి: పతంగం దేనిలోకి ఎగిరింది?',
            hi: 'अक्षरों को सही क्रम में लगाएं: पतंग किसमें उड़ी?',
          },
          jumbledLetters: 'RIA',
          answer: 'air',
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
          question: {
            en: 'Unscramble: The English word for పతంగం',
            te: 'అక్షరాలను క్రమంలో పెట్టండి: పతంగం కోసం ఇంగ్లీష్ పదం',
            hi: 'अक्षरों को सही क्रम में लगाएं: पतंग के लिए अंग्रेजी शब्द',
          },
          jumbledLetters: 'TEKI',
          answer: 'kite',
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
          question: {
            en: 'Unscramble: What is the first word?',
            te: 'అక్షరాలను క్రమంలో పెట్టండి: మొదటి పదం ఏమిటి?',
            hi: 'अक्षरों को सही क्रम में लगाएं: पहला शब्द क्या है?',
          },
          jumbledLetters: 'LNPAOGIN',
          answer: 'Pangolin',
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
          question: {
            en: 'Unscramble: A word that describes the sky',
            te: 'అక్షరాలను క్రమంలో పెట్టండి: ఆకాశాన్ని వివరించే పదం',
            hi: 'अक्षरों को सही क्रम में लगाएं: आकाश का वर्णन करने वाला शब्द',
          },
          jumbledLetters: 'EULB',
          answer: 'blue',
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

    // Feedback
    correct: 'Correct! Well done!',
    incorrect: 'Not quite right. Try again!',
    incorrectSecond: 'Let\'s try a hint to help you.',

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
    matched: 'Matched!',

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

    // Feedback
    correct: 'సరైనది! బాగా చేసారు!',
    incorrect: 'సరైనది కాదు. మళ్లీ ప్రయత్నించండి!',
    incorrectSecond: 'మీకు సహాయం చేయడానికి ఒక సూచన ప్రయత్నిద్దాం.',

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
    matched: 'సరిపోలింది!',

    // Sentence Building
    sentenceBuildingInstruction: 'సరైన వాక్యాన్ని రూపొందించడానికి పదాలను లాగండి',
    yourAnswer: 'మీ సమాధానం:',

    // MCQ
    mcqInstruction: 'సరైన సమాధానాన్ని ఎంచుకోండి',
  },
  hi: {
    // Common
    submit: 'जमा करें',
    tryAgain: 'पुनः प्रयास करें',
    continue: 'जारी रखें',
    hint: 'संकेत',
    close: 'बंद करें',

    // Feedback
    correct: 'सही! बहुत बढ़िया!',
    incorrect: 'बिल्कुल सही नहीं। फिर से कोशिश करें!',
    incorrectSecond: 'आपकी मदद के लिए एक संकेत आजमाते हैं।',

    // Drawing Challenge
    drawingInstruction: 'अपना उत्तर बनाने के लिए नीचे दिए गए उपकरणों का उपयोग करें',
    drawingPlaceholder: 'यहाँ बनाएं',
    colorPalette: 'रंग',
    delete: 'मिटाएं',

    // Fill in Blanks
    fillBlanksInstruction: 'लापता शब्द टाइप करें या सुझावों में से चुनें',
    typeHere: 'यहाँ टाइप करें...',

    // Match Pairs
    matchPairsInstruction: 'अंग्रेजी शब्दों को अनुवाद से मिलाने के लिए जोड़े पर क्लिक करें',
    matched: 'मिलान किया!',

    // Sentence Building
    sentenceBuildingInstruction: 'सही वाक्य बनाने के लिए शब्दों को खींचें',
    yourAnswer: 'आपका उत्तर:',

    // MCQ
    mcqInstruction: 'सही उत्तर चुनें',
  },
};
