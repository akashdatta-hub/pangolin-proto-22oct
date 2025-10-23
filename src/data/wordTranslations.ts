// Word translations for story vocabulary
// Maps English words to Telugu and Hindi translations

export interface WordTranslation {
  en: string;
  te: string;
  hi: string;
}

// Translation dictionary for Kite Festival story
export const wordTranslations: Record<string, WordTranslation> = {
  // Story 1: Kite Festival - Common nouns
  kite: { en: 'kite', te: 'పటం', hi: 'पतंग' },
  sky: { en: 'sky', te: 'ఆకాశం', hi: 'आकाश' },
  morning: { en: 'morning', te: 'ఉదయం', hi: 'सुबह' },
  field: { en: 'field', te: 'మైదానం', hi: 'मैदान' },
  festival: { en: 'festival', te: 'పండుగ', hi: 'त्यौहार' },
  friend: { en: 'friend', te: 'స్నేహితుడు', hi: 'दोस्त' },
  friends: { en: 'friends', te: 'స్నేహితులు', hi: 'दोस्त' },
  wind: { en: 'wind', te: 'గాలి', hi: 'हवा' },
  tree: { en: 'tree', te: 'చెట్టు', hi: 'पेड़' },
  string: { en: 'string', te: 'దారం', hi: 'डोर' },
  spool: { en: 'spool', te: 'చుట్టు', hi: 'चरखी' },
  branches: { en: 'branches', te: 'కొమ్మలు', hi: 'शाखाएँ' },
  stars: { en: 'stars', te: 'నక్షత్రాలు', hi: 'सितारे' },

  // Action words
  held: { en: 'held', te: 'పట్టుకున్నారు', hi: 'पकड़ा' },
  lifted: { en: 'lifted', te: 'ఎత్తింది', hi: 'उठाया' },
  dance: { en: 'dance', te: 'నృత్యం', hi: 'नृत्य' },
  pulled: { en: 'pulled', te: 'లాగింది', hi: 'खींचा' },
  tangled: { en: 'tangled', te: 'చిక్కుకుంది', hi: 'उलझा' },
  gasped: { en: 'gasped', te: 'ఊపిరి పట్టింది', hi: 'हांफा' },
  climb: { en: 'climb', te: 'ఎక్కింది', hi: 'चढ़ना' },
  cheered: { en: 'cheered', te: 'ఆనందించారు', hi: 'खुशी मनाई' },
  hugged: { en: 'hugged', te: 'కౌగిలించారు', hi: 'गले लगाया' },
  fixed: { en: 'fixed', te: 'సరిచేసారు', hi: 'ठीक किया' },
  soared: { en: 'soared', te: 'ఎగిరింది', hi: 'उड़ गया' },

  // Descriptive words
  bright: { en: 'bright', te: 'ప్రకాశవంతమైన', hi: 'चमकदार' },
  blue: { en: 'blue', te: 'నీలం', hi: 'नीला' },
  colorful: { en: 'colorful', te: 'రంగురంగుల', hi: 'रंगीन' },
  new: { en: 'new', te: 'కొత్త', hi: 'नया' },
  excited: { en: 'excited', te: 'ఉత్సాహంగా', hi: 'उत्साहित' },
  annual: { en: 'annual', te: 'వార్షిక', hi: 'वार्षिक' },
  strong: { en: 'strong', te: 'బలమైన', hi: 'मजबूत' },
  tall: { en: 'tall', te: 'ఎత్తైన', hi: 'लंबा' },
  tight: { en: 'tight', te: 'బిగించి', hi: 'कसकर' },
  gently: { en: 'gently', te: 'మెల్లగా', hi: 'धीरे से' },
  high: { en: 'high', te: 'ఎత్తుగా', hi: 'ऊँचा' },
  gold: { en: 'gold', te: 'బంగారం', hi: 'सोना' },

  // Common words
  it: { en: 'it', te: 'అది', hi: 'यह' },
  the: { en: 'the', te: '', hi: '' }, // No direct translation
  was: { en: 'was', te: 'ఉంది', hi: 'था' },
  in: { en: 'in', te: 'లో', hi: 'में' },
  and: { en: 'and', te: 'మరియు', hi: 'और' },
  his: { en: 'his', te: 'అతని', hi: 'उसका' },
  two: { en: 'two', te: 'రెండు', hi: 'दो' },
  my: { en: 'my', te: 'నా', hi: 'मेरा' },
  one: { en: 'one', te: 'ఒకటి', hi: 'एक' },
  three: { en: 'three', te: 'మూడు', hi: 'तीन' },
  go: { en: 'go', te: 'వెళ్ళు', hi: 'जाओ' },
  no: { en: 'no', te: 'కాదు', hi: 'नहीं' },
  oh: { en: 'oh', te: 'ఓహ్', hi: 'ओह' },
  up: { en: 'up', te: 'పైకి', hi: 'ऊपर' },
  down: { en: 'down', te: 'క్రింద', hi: 'नीचे' },
  we: { en: 'we', te: 'మేము', hi: 'हम' },
  together: { en: 'together', te: 'కలిసి', hi: 'साथ में' },
  today: { en: 'today', te: 'ఈరోజు', hi: 'आज' },

  // Names and places
  pangolin: { en: 'pangolin', te: 'పాంగోలిన్', hi: 'पैंगोलिन' },
  hanumakonda: { en: 'hanumakonda', te: 'హనుమకొండ', hi: 'हनुमकोंडा' },
  meera: { en: 'meera', te: 'మీరా', hi: 'मीरा' },
  ravi: { en: 'ravi', te: 'రవి', hi: 'रवि' },
};

// Helper function to get translation
export const getWordTranslation = (word: string, targetLang: 'en' | 'te' | 'hi'): string => {
  const normalizedWord = word.toLowerCase().replace(/[^a-z]/g, '');
  const translation = wordTranslations[normalizedWord];

  if (!translation) {
    console.warn(`No translation found for word: "${word}"`);
    return word; // Return original if no translation
  }

  return translation[targetLang] || word;
};
