// Story content for Pangolin game
// Structure supports multi-language (English, Telugu, Hindi)

export interface Story {
  id: string;
  title: {
    en: string;
    te: string;
    hi: string;
  };
  description: {
    en: string;
    te: string;
    hi: string;
  };
  pages: StoryPage[];
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustration?: string; // Path to illustration image
}

export const stories: Record<string, Story> = {
  'kite-festival': {
    id: 'kite-festival',
    title: {
      en: 'Kite Festival',
      te: 'పటాల పండుగ',
      hi: 'पतंग महोत्सव',
    },
    description: {
      en: 'Nouns, Action words, Descriptive/abstract',
      te: 'నామవాచకాలు, క్రియా పదాలు, వివరణాత్మక/నైరూప్య',
      hi: 'संज्ञा, क्रिया शब्द, वर्णनात्मक/अमूर्त',
    },
    pages: [
      {
        pageNumber: 1,
        text: "It was a bright morning in Hanumakonda. The sky looked like a big blue ocean filled with colorful kites. Pangolin and his two friends, Meera and Ravi, ran to the open field carrying their new kite. Everyone was excited for the annual Kite Festival!",
        illustration: '/assets/story1-page1.jpg',
      },
      {
        pageNumber: 2,
        text: 'Meera held the kite, Ravi held the spool, and Pangolin counted, "One, two, three—Go!" The kite lifted into the air and began to dance with the wind. Pangolin\'s eyes sparkled as the string tightened in his tiny paws.',
        illustration: '/assets/story1-page2.jpg',
      },
      {
        pageNumber: 3,
        text: 'Suddenly, a strong gust of wind pulled the kite higher—too high! It spun wildly and got tangled in the branches of a tall mango tree. Pangolin gasped. "Oh no! My kite!" Meera and Ravi looked up, worried.',
        illustration: '/assets/story1-page3.png',
      },
      {
        pageNumber: 4,
        text: 'The friends thought hard. Meera said, "Let\'s pull gently!" Ravi climbed a few steps up the tree and reached for the string. Pangolin held the spool tight and cheered them on. Slowly, the kite began to come free.',
        illustration: '/assets/story1-page4.png',
      },
      {
        pageNumber: 5,
        text: 'With one last tug, the kite floated down gently. Pangolin hugged his friends. "We did it together!" he said. They fixed the string and sent it flying again. As it soared high, gold stars glittered across the sky — just like the ones Pangolin earned today.',
        illustration: '/assets/story1-page5.png',
      },
    ],
  },
  'shell-song': {
    id: 'shell-song',
    title: {
      en: 'The Shell Song',
      te: 'షెల్ పాట',
      hi: 'शंख गीत',
    },
    description: {
      en: 'Nouns, Action words, Descriptive/abstract',
      te: 'నామవాచకాలు, క్రియా పదాలు, వివరణాత్మక/నైరూప్య',
      hi: 'संज्ञा, क्रिया शब्द, वर्णनात्मक/अमूर्त',
    },
    pages: [], // To be added later
  },
  'rainy-race': {
    id: 'rainy-race',
    title: {
      en: 'The Rainy Race',
      te: 'వర్షపు పోటీ',
      hi: 'बारिश की दौड़',
    },
    description: {
      en: 'Nouns, Action words, Descriptive/abstract',
      te: 'నామవాచకాలు, క్రియా పదాలు, వివరణాత్మక/నైరూప్య',
      hi: 'संज्ञा, क्रिया शब्द, वर्णनात्मक/अमूर्त',
    },
    pages: [], // To be added later
  },
  'garden-helpers': {
    id: 'garden-helpers',
    title: {
      en: 'The Garden Helpers',
      te: 'తోట సహాయకులు',
      hi: 'बगीचे के सहायक',
    },
    description: {
      en: 'Nouns, Action words, Descriptive/abstract',
      te: 'నామవాచకాలు, క్రియా పదాలు, వివరణాత్మక/నైరూప్య',
      hi: 'संज्ञा, क्रिया शब्द, वर्णनात्मक/अमूर्त',
    },
    pages: [], // To be added later
  },
};

// UI text labels - will support multi-language
export const uiLabels = {
  en: {
    // Home Screen
    stories: 'Stories',
    collection: 'Collection',
    read: 'Read',
    practice: 'Practice',
    upcoming: 'Upcoming',
    completed: 'Completed',
    startStory: 'Start Story',
    littleExplorer: 'Little Explorer',
    littleExplorerDesc: 'Complete the first story to earn this badge.',
    learningOutcome: 'Learning outcome:',
    comingSoon: 'Coming soon',
    story: 'Story',

    // Story Page
    readThisPage: 'Read this page',
    clickWordsInstruction: 'Click on the words to listen to them',
    readyForChallenge: 'Ready for a challenge?',
    playChallenge: 'Play challenge',
    next: 'Next',
    nextPage: 'Next Page',
    previous: 'Previous',

    // Challenge Common
    challenge: 'Challenge',
    of: 'of',
    submit: 'Submit',
    tryAgain: 'Try Again',
    continue: 'Continue',
    correct: 'Correct! Well done!',
    incorrect: 'Not quite right. Try again!',
    incorrectSecond: 'Let me show you the correct answer.',
    hint: 'Hint',
    skip: 'Skip',
    back: 'Back',
    checkAnswer: 'Check answer',
    correctAnswer: 'Correct answer!',
    collectStar: 'Collect star',
    tryAgainMessage: 'Try again, you\'ve got this!',
    attemptsLeft: 'attempt left',
    typeHere: 'Type here...',
    moveOnMessage: 'Let\'s move on and try again later',
    revisitLater: 'Revisit later',

    // Drawing Challenge
    drawInstruction: 'Draw the following words',
    clear: 'Clear',

    // Fill in Blanks Challenge
    fillBlanksInstruction: 'Fill in the blank with the correct word',
    suggestedWords: 'Suggested words',

    // Match Pairs Challenge
    matchInstruction: 'Match the following words',
    matched: 'matched',

    // Sentence Building Challenge
    sentenceBuildingInstruction: 'Click on the words below to build the correct sentence',
    yourAnswer: 'Your answer',
    availableWords: 'Available words',

    // MCQ Challenge
    mcqInstruction: 'Choose the correct answer',

    // Story Complete Page
    storyComplete: 'Story complete!',
    wordsLearned: 'words learned',
    moreWordsToLearn: 'more words to learn',
    starsCollected: 'stars collected',
    reviseChallenges: 'Revise challenges',
    youCollectedBadge: 'You also collected a badge!',
    youCollectedBadges: 'You also collected 2 badges!',
    backToHome: 'Back to Home',
    takeVocabularyTest: 'Take Vocabulary Test',
    lastChallenge: 'Last challenge: Test your newly learned words with 3 quick questions!',
    wordExplorer: 'Word Explorer',
    wordExplorerDesc: 'Completing your first story',
    strongStart: 'Strong Start',
    strongStartDesc: 'Earned 5 stars',

    // Vocabulary Test
    vocabularyTest: 'Vocabulary Test',
    questionPrefix: 'Which of the words below is',
    questionSuffix: 'in English?',
    testComplete: 'Test Complete!',
    yourScore: 'Your Score',
    question: 'Question',
    correctCount: 'correct',
    selectCorrectAnswer: 'Select the correct answer',
    finish: 'Finish',
    nextQuestion: 'Next Question',
    nextStory: 'Next story:',
  },
  te: {
    // Home Screen
    stories: 'కథలు',
    collection: 'సేకరణ',
    read: 'చదవండి',
    practice: 'అభ్యాసం',
    upcoming: 'రాబోయేవి',
    completed: 'పూర్తయింది',
    startStory: 'కథ ప్రారంభించండి',
    littleExplorer: 'చిన్న అన్వేషకుడు',
    littleExplorerDesc: 'ఈ బ్యాడ్జ్ పొందడానికి మొదటి కథను పూర్తి చేయండి.',
    learningOutcome: 'నేర్చుకునే ఫలితం:',
    comingSoon: 'త్వరలో వస్తుంది',
    story: 'కథ',

    // Story Page
    readThisPage: 'ఈ పేజీని చదవండి',
    clickWordsInstruction: 'పదాలను వినడానికి వాటిపై క్లిక్ చేయండి',
    readyForChallenge: 'సవాలుకు సిద్ధంగా ఉన్నారా?',
    playChallenge: 'సవాలు ఆడండి',
    next: 'తదుపరి',
    nextPage: 'తదుపరి పేజీ',
    previous: 'మునుపటి',

    // Challenge Common
    challenge: 'సవాలు',
    of: 'లో',
    submit: 'సమర్పించండి',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    continue: 'కొనసాగించండి',
    correct: 'సరైనది! బాగా చేసారు!',
    incorrect: 'సరిగ్గా లేదు. మళ్లీ ప్రయత్నించండి!',
    incorrectSecond: 'సరైన సమాధానం చూపిస్తాను.',
    hint: 'సూచన',
    skip: 'దాటవేయండి',
    back: 'వెనక్కు',
    checkAnswer: 'సమాధానాన్ని తనిఖీ చేయండి',
    correctAnswer: 'సరైన సమాధానం!',
    collectStar: 'నక్షత్రాన్ని సేకరించండి',
    tryAgainMessage: 'మళ్లీ ప్రయత్నించండి, మీరు దీన్ని చేయగలరు!',
    attemptsLeft: 'ప్రయత్నం మిగిలి ఉంది',
    typeHere: 'ఇక్కడ టైప్ చేయండి...',
    moveOnMessage: 'ముందుకు వెళ్దాం మరియు తర్వాత మళ్లీ ప్రయత్నిద్దాం',
    revisitLater: 'తర్వాత మళ్లీ చూడండి',

    // Drawing Challenge
    drawInstruction: 'ఈ క్రింది పదాలను గీయండి',
    clear: 'తొలగించు',

    // Fill in Blanks Challenge
    fillBlanksInstruction: 'సరైన పదంతో ఖాళీని పూరించండి',
    suggestedWords: 'సూచించిన పదాలు',

    // Match Pairs Challenge
    matchInstruction: 'ఈ క్రింది పదాలను జతపరచండి',
    matched: 'జతపరచబడింది',

    // Sentence Building Challenge
    sentenceBuildingInstruction: 'సరైన వాక్యాన్ని రూపొందించడానికి క్రింది పదాలపై క్లిక్ చేయండి',
    yourAnswer: 'మీ సమాధానం',
    availableWords: 'అందుబాటులో ఉన్న పదాలు',

    // MCQ Challenge
    mcqInstruction: 'సరైన సమాధానాన్ని ఎంచుకోండి',

    // Story Complete Page
    storyComplete: 'కథ పూర్తయింది!',
    wordsLearned: 'పదాలు నేర్చుకున్నారు',
    moreWordsToLearn: 'నేర్చుకోవలసిన మరిన్ని పదాలు',
    starsCollected: 'నక్షత్రాలు సేకరించారు',
    reviseChallenges: 'సవాళ్లను సమీక్షించండి',
    youCollectedBadge: 'మీరు ఒక బ్యాడ్జ్ కూడా సేకరించారు!',
    youCollectedBadges: 'మీరు 2 బ్యాడ్జ్‌లు సేకరించారు!',
    backToHome: 'హోమ్‌కు తిరిగి వెళ్లండి',
    takeVocabularyTest: 'శబ్దకోశ పరీక్ష తీసుకోండి',
    lastChallenge: 'చివరి సవాలు: 3 త్వరిత ప్రశ్నలతో మీరు కొత్తగా నేర్చుకున్న పదాలను పరీక్షించండి!',
    wordExplorer: 'వర్డ్ ఎక్స్‌ప్లోరర్',
    wordExplorerDesc: 'మీ మొదటి కథను పూర్తి చేయడం',
    strongStart: 'స్ట్రాంగ్ స్టార్ట్',
    strongStartDesc: '5 నక్షత్రాలు సంపాదించారు',

    // Vocabulary Test
    vocabularyTest: 'శబ్దకోశ పరీక్ష',
    questionPrefix: 'క్రింది పదాలలో',
    questionSuffix: 'ఇంగ్లీష్‌లో ఏది?',
    testComplete: 'పరీక్ష పూర్తయింది!',
    yourScore: 'మీ స్కోర్',
    question: 'ప్రశ్న',
    correctCount: 'సరైనవి',
    selectCorrectAnswer: 'సరైన సమాధానాన్ని ఎంచుకోండి',
    finish: 'ముగించు',
    nextQuestion: 'తదుపరి ప్రశ్న',
    nextStory: 'తదుపరి కథ:',
  },
  hi: {
    // Home Screen
    stories: 'कहानियाँ',
    collection: 'संग्रह',
    read: 'पढ़ें',
    practice: 'अभ्यास',
    upcoming: 'आगामी',
    completed: 'पूर्ण',
    startStory: 'कहानी शुरू करें',
    littleExplorer: 'छोटा खोजकर्ता',
    littleExplorerDesc: 'यह बैज प्राप्त करने के लिए पहली कहानी पूरी करें।',
    learningOutcome: 'सीखने का परिणाम:',
    comingSoon: 'जल्द आ रहा है',
    story: 'कहानी',

    // Story Page
    readThisPage: 'यह पृष्ठ पढ़ें',
    clickWordsInstruction: 'शब्दों को सुनने के लिए उन पर क्लिक करें',
    readyForChallenge: 'चुनौती के लिए तैयार हैं?',
    playChallenge: 'चुनौती खेलें',
    next: 'अगला',
    nextPage: 'अगला पृष्ठ',
    previous: 'पिछला',

    // Challenge Common
    challenge: 'चुनौती',
    of: 'में से',
    submit: 'जमा करें',
    tryAgain: 'फिर से कोशिश करें',
    continue: 'जारी रखें',
    correct: 'सही! अच्छा किया!',
    incorrect: 'बिल्कुल सही नहीं। फिर से कोशिश करें!',
    incorrectSecond: 'मैं आपको सही उत्तर दिखाता हूं।',
    hint: 'संकेत',
    skip: 'छोड़ें',
    back: 'वापस',
    checkAnswer: 'उत्तर जांचें',
    correctAnswer: 'सही उत्तर!',
    collectStar: 'सितारा इकट्ठा करें',
    tryAgainMessage: 'फिर से कोशिश करें, आप यह कर सकते हैं!',
    attemptsLeft: 'प्रयास शेष है',
    typeHere: 'यहाँ टाइप करें...',
    moveOnMessage: 'आगे बढ़ें और बाद में फिर से प्रयास करें',
    revisitLater: 'बाद में फिर से देखें',

    // Drawing Challenge
    drawInstruction: 'निम्नलिखित शब्दों को बनाएं',
    clear: 'साफ़ करें',

    // Fill in Blanks Challenge
    fillBlanksInstruction: 'सही शब्द से रिक्त स्थान भरें',
    suggestedWords: 'सुझाए गए शब्द',

    // Match Pairs Challenge
    matchInstruction: 'निम्नलिखित शब्दों का मिलान करें',
    matched: 'मिलान किया गया',

    // Sentence Building Challenge
    sentenceBuildingInstruction: 'सही वाक्य बनाने के लिए नीचे दिए गए शब्दों पर क्लिक करें',
    yourAnswer: 'आपका उत्तर',
    availableWords: 'उपलब्ध शब्द',

    // MCQ Challenge
    mcqInstruction: 'सही उत्तर चुनें',

    // Story Complete Page
    storyComplete: 'कहानी पूर्ण!',
    wordsLearned: 'शब्द सीखे',
    moreWordsToLearn: 'सीखने के लिए और शब्द',
    starsCollected: 'सितारे एकत्र किए',
    reviseChallenges: 'चुनौतियों की समीक्षा करें',
    youCollectedBadge: 'आपने एक बैज भी एकत्र किया!',
    youCollectedBadges: 'आपने 2 बैज एकत्र किए!',
    backToHome: 'होम पर वापस जाएं',
    takeVocabularyTest: 'शब्दावली परीक्षा लें',
    lastChallenge: 'अंतिम चुनौती: 3 त्वरित प्रश्नों के साथ अपने नए सीखे शब्दों का परीक्षण करें!',
    wordExplorer: 'वर्ड एक्सप्लोरर',
    wordExplorerDesc: 'अपनी पहली कहानी पूरी करना',
    strongStart: 'स्ट्रॉन्ग स्टार्ट',
    strongStartDesc: '5 सितारे अर्जित किए',

    // Vocabulary Test
    vocabularyTest: 'शब्दावली परीक्षा',
    questionPrefix: 'नीचे दिए गए शब्दों में से',
    questionSuffix: 'अंग्रेजी में कौन सा है?',
    testComplete: 'परीक्षा पूर्ण!',
    yourScore: 'आपका स्कोर',
    question: 'प्रश्न',
    correctCount: 'सही',
    selectCorrectAnswer: 'सही उत्तर चुनें',
    finish: 'समाप्त करें',
    nextQuestion: 'अगला प्रश्न',
    nextStory: 'अगली कहानी:',
  },
};
