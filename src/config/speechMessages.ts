// Speech messages for different scenarios
// Defines what to say when for TTS

export type SpeechScenario =
  // Challenge instructions (spoken after question)
  | 'instruction-fill-blanks'
  | 'instruction-mcq'
  | 'instruction-match-pairs'
  | 'instruction-sentence-building'

  // Challenge scenarios
  | 'challenge-correct-first'
  | 'challenge-correct-second'
  | 'challenge-incorrect-first'
  | 'challenge-incorrect-second'
  | 'challenge-matched'
  | 'challenge-streak-3'

  // Completion scenarios
  | 'completion-perfect'
  | 'completion-good'
  | 'completion-needs-practice'
  | 'completion-vocabulary-prompt'

  // Thank You page scenarios
  | 'thankyou-intro'
  | 'thankyou-excellent'
  | 'thankyou-good'
  | 'thankyou-keep-practicing'
  | 'thankyou-description';

export interface SpeechMessage {
  en: string;
  te: string;
  hi: string;
}

// Speech messages database
export const speechMessages: Record<SpeechScenario, SpeechMessage> = {
  // Challenge instructions (spoken after the question)
  'instruction-fill-blanks': {
    en: 'Type the missing word or select from suggestions.',
    te: 'తప్పిపోయిన పదాన్ని టైప్ చేయండి లేదా సూచనల నుండి ఎంచుకోండి.',
    hi: 'लापता शब्द टाइप करें या सुझावों में से चुनें।',
  },

  'instruction-mcq': {
    en: 'Choose the correct answer.',
    te: 'సరైన సమాధానాన్ని ఎంచుకోండి.',
    hi: 'सही उत्तर चुनें।',
  },

  'instruction-match-pairs': {
    en: 'Match the following words.',
    te: 'కింది పదాలను జతపరచండి.',
    hi: 'इन शब्दों को मिलाएं।',
  },

  'instruction-sentence-building': {
    en: 'Click on the words below to build the correct sentence.',
    te: 'సరైన వాక్యాన్ని రూపొందించడానికి క్రింది పదాలపై క్లిక్ చేయండి.',
    hi: 'सही वाक्य बनाने के लिए नीचे दिए गए शब्दों पर क्लिक करें।',
  },

  // First attempt correct
  'challenge-correct-first': {
    en: 'First try. You are good at this',
    te: 'మొదటి ప్రయత్నంలోనే. మీరు దీనిలో మంచివారు',
    hi: 'पहली कोशिश में। आप इसमें अच्छे हैं',
  },

  // Second attempt correct
  'challenge-correct-second': {
    en: 'That is right',
    te: 'అదే సరైనది',
    hi: 'यह सही है',
  },

  // First attempt incorrect
  'challenge-incorrect-first': {
    en: 'Do you want to try again. You can use a hint',
    te: 'మీరు మళ్లీ ప్రయత్నించాలనుకుంటున్నారా. మీరు సూచనను ఉపయోగించవచ్చు',
    hi: 'क्या आप फिर से कोशिश करना चाहते हैं। आप हिंट ले सकते हैं',
  },

  // Second attempt incorrect (failed twice)
  'challenge-incorrect-second': {
    en: 'Let us try this later',
    te: 'మనం దీన్ని తర్వాత ప్రయత్నిద్దాం',
    hi: 'आइए इसे बाद में आजमाएं',
  },

  // Match pairs - when a pair is matched successfully
  'challenge-matched': {
    en: 'Match',
    te: 'మ్యాచ్',
    hi: 'मिल गया',
  },

  // Got 3 challenges correct in a row
  'challenge-streak-3': {
    en: 'That is three in a row. Keep going',
    te: 'వరుసగా మూడు. కొనసాగించండి',
    hi: 'यह तीन बार एक के बाद एक। शाबाश, ऐसे ही करते रहो',
  },

  // Perfect score (5/5)
  'completion-perfect': {
    en: 'You completed the story with a perfect score. Congratulations',
    te: 'మీరు పరిపూర్ణ స్కోర్‌తో కథను పూర్తి చేశారు. అభినందనలు',
    hi: 'आपने कहानी पूरी की और सभी सवाल सही किए। बधाई हो',
  },

  // Good score (4/5)
  'completion-good': {
    en: 'You completed the story and earned two badges',
    te: 'మీరు కథను పూర్తి చేసి రెండు బ్యాడ్జ్‌లు సంపాదించారు',
    hi: 'आपने कहानी पूरी की और दो बैज जीते',
  },

  // Needs practice (3/5 or less)
  'completion-needs-practice': {
    en: 'Congratulations on completing the first story',
    te: 'మొదటి కథను పూర్తి చేసినందుకు అభినందనలు',
    hi: 'पहली कहानी पूरी करने पर बधाई',
  },

  // Vocabulary test prompt (after 3 second delay)
  'completion-vocabulary-prompt': {
    en: 'Last challenge. Test your newly learned words with three quick questions',
    te: 'చివరి సవాలు. మీరు కొత్తగా నేర్చుకున్న పదాలను మూడు త్వరిత ప్రశ్నలతో పరీక్షించండి',
    hi: 'आखिरी सवाल। अपने नए शब्दों को तीन आसान सवालों से जांचो',
  },

  // Thank You page - Introduction message
  'thankyou-intro': {
    en: 'Thank you for completing the test',
    te: 'పరీక్షను పూర్తి చేసినందుకు ధన్యవాదాలు',
    hi: 'परीक्षण पूरा करने के लिए धन्यवाद',
  },

  // Thank You page - Excellent performance (80%+)
  'thankyou-excellent': {
    en: 'Excellent work',
    te: 'అద్భుతమైన పని',
    hi: 'उत्कृष्ट कार्य',
  },

  // Thank You page - Good performance (60-79%)
  'thankyou-good': {
    en: 'Good job',
    te: 'మంచి పని',
    hi: 'अच्छा काम',
  },

  // Thank You page - Needs more practice (<60%)
  'thankyou-keep-practicing': {
    en: 'Keep practicing',
    te: 'అభ్యాసం కొనసాగించండి',
    hi: 'अभ्यास जारी रखें',
  },

  // Thank You page - Final description
  'thankyou-description': {
    en: 'You have completed the Kite Festival story and vocabulary test. Thank you for participating in this learning experience',
    te: 'మీరు పతంగాల పండుగ కథ మరియు పదజాల పరీక్షను పూర్తి చేసారు. ఈ అభ్యాస అనుభవంలో పాల్గొన్నందుకు ధన్యవాదాలు',
    hi: 'आपने पतंग महोत्सव की कहानी और शब्दावली परीक्षण पूरा कर लिया है। इस सीखने के अनुभव में भाग लेने के लिए धन्यवाद',
  },
};

// Helper to get speech message
export const getSpeechMessage = (
  scenario: SpeechScenario,
  language: 'en' | 'te' | 'hi'
): string => {
  const message = speechMessages[scenario];
  return message[language] || message.en;
};
