import { getVoiceSettings, findBestVoice, type SpeechContext } from '../config/voiceRules';

// Track if voices are loaded
let voicesLoaded = false;
let voicesLoadedCallbacks: (() => void)[] = [];
let voiceLoadingInitiated = false;

// Tab resume handler - resume TTS when tab becomes visible again
let tabResumeHandlerInitialized = false;
const initTabResumeHandler = () => {
  if (tabResumeHandlerInitialized) return;

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Tab is now visible - check if speech synthesis is stuck
      if (window.speechSynthesis.paused) {
        console.log('🔄 Tab resumed - resuming paused speech');
        window.speechSynthesis.resume();
      }
      // If speaking but seems stuck, try to restart
      if (window.speechSynthesis.speaking && window.speechSynthesis.pending) {
        console.log('⚠️ Speech synthesis appears stuck - canceling and will retry on next speak');
        window.speechSynthesis.cancel();
      }
    }
  });

  tabResumeHandlerInitialized = true;
  console.log('✅ Tab resume handler initialized');
};

// Initialize voice loading early (call this as soon as the app loads)
export const initVoiceLoading = () => {
  if (voiceLoadingInitiated) return;
  voiceLoadingInitiated = true;

  console.log('🎤 Initiating voice loading...');

  // Try to load voices immediately
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesLoaded = true;
    console.log('✅ Voices loaded immediately:', voices.length);
    return;
  }

  // Set up listener for voice loading
  window.speechSynthesis.onvoiceschanged = () => {
    if (!voicesLoaded) {
      voicesLoaded = true;
      const loadedVoices = window.speechSynthesis.getVoices();
      console.log('🎤 Voices loaded via onvoiceschanged:', loadedVoices.length);
      voicesLoadedCallbacks.forEach(cb => cb());
      voicesLoadedCallbacks = [];
    }
  };

  // Start polling to trigger voice loading
  let attempts = 0;
  const checkInterval = setInterval(() => {
    attempts++;
    const currentVoices = window.speechSynthesis.getVoices();

    if (currentVoices.length > 0 && !voicesLoaded) {
      console.log(`🎤 Voices loaded after ${attempts} polling attempts:`, currentVoices.length);
      clearInterval(checkInterval);
      voicesLoaded = true;
      voicesLoadedCallbacks.forEach(cb => cb());
      voicesLoadedCallbacks = [];
    } else if (attempts >= 50) {
      // After 50 attempts (5 seconds), stop polling but keep waiting for onvoiceschanged
      console.warn('⚠️ Voice loading polling stopped after 5 seconds, still waiting for onvoiceschanged event');
      clearInterval(checkInterval);
    }
  }, 100);
};

// Wait for voices to be loaded (Chrome timing issue fix)
// Enhanced to wait longer and retry voice loading
const waitForVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    // If voices already loaded, resolve immediately
    if (voicesLoaded) {
      console.log('✅ Voices already loaded');
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      console.log('✅ Voices available:', voices.length);
      resolve();
      return;
    }

    console.log('⏳ Waiting for voices to load...');

    // Add to callback queue
    voicesLoadedCallbacks.push(resolve);

    // Initiate voice loading if not already done
    if (!voiceLoadingInitiated) {
      initVoiceLoading();
    }

    // Safety timeout - resolve after 10 seconds even if voices haven't loaded
    setTimeout(() => {
      console.warn('⚠️ Voice loading timeout after 10 seconds, proceeding anyway');
      resolve();
    }, 10000);
  });
};

// Helper: Get the effective language for TTS (with fallback logic)
// If Telugu voice doesn't exist, fall back to Hindi
export const getSpeechLanguage = (requestedLang: string): 'en' | 'te' | 'hi' => {
  if (requestedLang === 'te') {
    const voices = window.speechSynthesis.getVoices();
    const hasTeluguVoice = voices.some(v => v.lang.startsWith('te'));
    if (!hasTeluguVoice) {
      console.log('📢 No Telugu voice available, using Hindi for TTS');
      return 'hi'; // Fall back to Hindi
    }
  }
  return requestedLang as 'en' | 'te' | 'hi';
};

// Enhanced Text-to-Speech utility with voice rules
export const speak = async (
  text: string,
  lang: string = 'en',
  context: SpeechContext = 'default'
) => {
  if (!('speechSynthesis' in window)) {
    console.warn('❌ Speech synthesis not supported in this browser');
    return;
  }

  // Initialize tab resume handler (only once)
  initTabResumeHandler();

  // Wait for voices to load (Chrome fix)
  await waitForVoices();

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Apply language fallback logic (Telugu → Hindi if no Telugu voice)
  const effectiveLang = getSpeechLanguage(lang);

  // Get voice settings for this context and effective language
  const settings = getVoiceSettings(context, effectiveLang);

  // Create utterance with text
  const utterance = new SpeechSynthesisUtterance(text);

  // Apply voice settings
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  utterance.volume = settings.volume;

  // Map language codes (use effective language)
  const langMap: Record<string, string> = {
    en: 'en-US',
    te: 'te-IN',
    hi: 'hi-IN',
  };
  utterance.lang = langMap[effectiveLang] || 'en-US';

  // Try to find and set the best voice for this language (use effective language)
  const bestVoice = findBestVoice(effectiveLang);

  if (bestVoice) {
    utterance.voice = bestVoice;
    console.log(`🎤 Using voice: ${bestVoice.name} (${bestVoice.lang}) for context: ${context}`);
  } else {
    console.log(`⚠️ No preferred voice found for ${effectiveLang}, using default`);
  }

  // Debug logging
  if (lang !== effectiveLang) {
    console.log(`🔄 Language fallback: ${lang} → ${effectiveLang}`);
  }
  console.log(`🗣️ Speaking "${text.substring(0, 50)}..." | Context: ${context} | Rate: ${settings.rate} | Pitch: ${settings.pitch}`);

  // Error handler
  utterance.onerror = (event) => {
    console.error(`❌ Speech error: ${event.error}`, event);
  };

  // Success handlers
  utterance.onstart = () => {
    console.log(`✅ Speech started successfully`);
  };

  utterance.onend = () => {
    console.log(`✅ Speech completed successfully`);
  };

  // Speak
  window.speechSynthesis.speak(utterance);
};
