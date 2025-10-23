/**
 * Microsoft Clarity Analytics Wrapper
 * Uses official @microsoft/clarity npm package
 */

import Clarity from '@microsoft/clarity';

// Track if Clarity has been initialized
let isInitialized = false;

// Queue for calls made before initialization
const callQueue: Array<() => void> = [];

/**
 * Initialize Microsoft Clarity
 * Call this once when your app starts
 */
export function initializeClarity(projectId: string): void {
  if (typeof window !== 'undefined') {
    try {
      Clarity.init(projectId);
      isInitialized = true;
      console.log('✅ Microsoft Clarity initialized successfully');

      // Process queued calls
      while (callQueue.length > 0) {
        const fn = callQueue.shift();
        if (fn) {
          fn();
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize Clarity:', error);
    }
  }
}

/**
 * Helper to execute a call or queue it if Clarity isn't ready
 */
function executeOrQueue(fn: () => void): void {
  if (isInitialized) {
    fn();
  } else {
    console.log('⏳ Clarity not ready yet, queueing call');
    callQueue.push(fn);
  }
}

/**
 * Track a custom event with optional data
 */
export function trackEvent(eventName: string, data?: Record<string, string | number | boolean>): void {
  executeOrQueue(() => {
    try {
      console.log('📊 Tracking event:', eventName, data);

      // Set tags first if data provided
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          Clarity.setTag(key, String(value));
        });
      }

      // Fire the event
      Clarity.event(eventName);
    } catch (error) {
      console.warn('Failed to track event:', eventName, error);
    }
  });
}

/**
 * Set a custom tag/dimension
 */
export function setTag(key: string, value: string | number | boolean): void {
  executeOrQueue(() => {
    try {
      console.log('🏷️ Setting tag:', key, '=', value);
      Clarity.setTag(key, String(value));
    } catch (error) {
      console.warn('Failed to set tag:', key, error);
    }
  });
}

/**
 * Identify a user (optional, for future use)
 */
export function identifyUser(userId: string, sessionId?: string, pageId?: string): void {
  executeOrQueue(() => {
    try {
      Clarity.identify(userId, sessionId, pageId);
    } catch (error) {
      console.warn('Failed to identify user:', error);
    }
  });
}

/**
 * Upgrade session priority (for important events like errors)
 */
export function upgradeSession(reason: string): void {
  executeOrQueue(() => {
    try {
      console.log('⬆️ Upgrading session:', reason);
      Clarity.upgrade(reason);
    } catch (error) {
      console.warn('Failed to upgrade session:', error);
    }
  });
}
