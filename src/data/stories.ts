// Story content for Pangolin game
// Structure supports multi-language (English, Telugu, Hindi)

export interface Story {
  id: string;
  title: string;
  description: string;
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
    title: 'Kite Festival',
    description: 'Learn about Nouns, Action words, Descriptive/abstract',
    pages: [
      {
        pageNumber: 1,
        text: "It was a bright morning in the village. The sky looked like a big blue ocean filled with colorful kites. Pangolin and his two friends, Meera and Ravi, ran to the open field carrying their new kite. Everyone was excited for the annual Kite Festival!",
      },
      {
        pageNumber: 2,
        text: 'Meera held the kite, Ravi held the spool, and Pangolin counted, "One, two, three—Go!" The kite lifted into the air and began to dance with the wind. Pangolin\'s eyes sparkled as the string tightened in his tiny paws.',
      },
      {
        pageNumber: 3,
        text: 'Suddenly, a strong gust of wind pulled the kite higher—too high! It spun wildly and got tangled in the branches of a tall mango tree. Pangolin gasped. "Oh no! My kite!" Meera and Ravi looked up, worried.',
      },
      {
        pageNumber: 4,
        text: 'The friends thought hard. Meera said, "Let\'s pull gently!" Ravi climbed a few steps up the tree and reached for the string. Pangolin held the spool tight and cheered them on. Slowly, the kite began to come free.',
      },
      {
        pageNumber: 5,
        text: 'With one last tug, the kite floated down gently. Pangolin hugged his friends. "We did it together!" he said. They fixed the string and sent it flying again. As it soared high, gold stars glittered across the sky — just like the ones Pangolin earned today.',
      },
    ],
  },
  'shell-song': {
    id: 'shell-song',
    title: 'The Shell Song',
    description: 'Learn about Nouns, Action words, Descriptive/abstract',
    pages: [], // To be added later
  },
  'rainy-race': {
    id: 'rainy-race',
    title: 'The Rainy Race',
    description: 'Learn about Nouns, Action words, Descriptive/abstract',
    pages: [], // To be added later
  },
  'garden-helpers': {
    id: 'garden-helpers',
    title: 'The Garden Helpers',
    description: 'Learn about Nouns, Action words, Descriptive/abstract',
    pages: [], // To be added later
  },
};

// UI text labels - will support multi-language
export const uiLabels = {
  en: {
    stories: 'Stories',
    collection: 'Collection',
    read: 'Read',
    practice: 'Practice',
    upcoming: 'Upcoming',
    completed: 'Completed',
    littleExplorer: 'Little Explorer',
    littleExplorerDesc: 'Complete the first story to earn badge.',
    learningOutcome: 'Learning outcome:',
    readThisPage: 'Read this page',
    clickWordsInstruction: 'Click on the words to listen to them',
    readyForChallenge: 'Ready for a challenge?',
    playChallenge: 'Play challenge',
    storyComplete: 'Story complete!',
    wordsLearned: 'words learned in this story',
    moreWordsToLearn: 'more words to learn in this story',
    starsCollected: 'stars collected',
    reviseChallenges: 'Revise challenges',
    youCollectedBadge: 'You also collected a badge!',
    youCollectedBadges: 'You also collected 2 badges!',
    collection: 'Collection',
    nextStory: 'Next story:',
  },
  te: {
    // Telugu translations
    stories: 'కథలు',
    collection: 'సేకరణ',
    read: 'చదవండి',
    practice: 'అభ్యాసం',
    upcoming: 'రాబోయేవి',
    completed: 'పూర్తయింది',
    littleExplorer: 'చిన్న అన్వేషకుడు',
    littleExplorerDesc: 'బ్యాడ్జ్ పొందడానికి మొదటి కథను పూర్తి చేయండి.',
    learningOutcome: 'నేర్చుకునే ఫలితం:',
    readThisPage: 'ఈ పేజీని చదవండి',
    clickWordsInstruction: 'పదాలను వినడానికి వాటిపై క్లిక్ చేయండి',
    readyForChallenge: 'సవాలుకు సిద్ధంగా ఉన్నారా?',
    playChallenge: 'సవాలు ఆడండి',
    storyComplete: 'కథ పూర్తయింది!',
    wordsLearned: 'ఈ కథలో పదాలు నేర్చుకున్నారు',
    moreWordsToLearn: 'ఈ కథలో నేర్చుకోవలసిన మరిన్ని పదాలు',
    starsCollected: 'నక్షత్రాలు సేకరించారు',
    reviseChallenges: 'సవాళ్లను సమీక్షించండి',
    youCollectedBadge: 'మీరు ఒక బ్యాడ్జ్ కూడా సేకరించారు!',
    youCollectedBadges: 'మీరు 2 బ్యాడ్జ్‌లు సేకరించారు!',
    nextStory: 'తదుపరి కథ:',
  },
  hi: {
    // Hindi translations
    stories: 'कहानियाँ',
    collection: 'संग्रह',
    read: 'पढ़ें',
    practice: 'अभ्यास',
    upcoming: 'आगामी',
    completed: 'पूर्ण',
    littleExplorer: 'छोटा खोजकर्ता',
    littleExplorerDesc: 'बैज प्राप्त करने के लिए पहली कहानी पूरी करें।',
    learningOutcome: 'सीखने का परिणाम:',
    readThisPage: 'यह पृष्ठ पढ़ें',
    clickWordsInstruction: 'शब्दों को सुनने के लिए उन पर क्लिक करें',
    readyForChallenge: 'चुनौती के लिए तैयार हैं?',
    playChallenge: 'चुनौती खेलें',
    storyComplete: 'कहानी पूर्ण!',
    wordsLearned: 'इस कहानी में शब्द सीखे',
    moreWordsToLearn: 'इस कहानी में सीखने के लिए और शब्द',
    starsCollected: 'सितारे एकत्र किए',
    reviseChallenges: 'चुनौतियों की समीक्षा करें',
    youCollectedBadge: 'आपने एक बैज भी एकत्र किया!',
    youCollectedBadges: 'आपने 2 बैज एकत्र किए!',
    nextStory: 'अगली कहानी:',
  },
};
