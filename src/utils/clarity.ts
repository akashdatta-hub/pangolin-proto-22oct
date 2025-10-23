/**
 * Microsoft Clarity Analytics Wrapper
 * Uses official @microsoft/clarity npm package
 */

import Clarity from '@microsoft/clarity';

/**
 * Initialize Microsoft Clarity
 * Call this once when your app starts
 */
export function initializeClarity(projectId: string): void {
  if (typeof window !== 'undefined') {
    try {
      Clarity.init(projectId);
      console.log('✅ Microsoft Clarity initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Clarity:', error);
    }
  }
}

/**
 * Track a custom event with optional data
 */
export function trackEvent(eventName: string, data?: Record<string, string | number | boolean>): void {
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
}

/**
 * Set a custom tag/dimension
 */
export function setTag(key: string, value: string | number | boolean): void {
  try {
    console.log('🏷️ Setting tag:', key, '=', value);
    Clarity.setTag(key, String(value));
  } catch (error) {
    console.warn('Failed to set tag:', key, error);
  }
}

/**
 * Identify a user (optional, for future use)
 */
export function identifyUser(userId: string, sessionId?: string, pageId?: string): void {
  try {
    Clarity.identify(userId, sessionId, pageId);
  } catch (error) {
    console.warn('Failed to identify user:', error);
  }
}

/**
 * Upgrade session priority (for important events like errors)
 */
export function upgradeSession(reason: string): void {
  try {
    console.log('⬆️ Upgrading session:', reason);
    Clarity.upgrade(reason);
  } catch (error) {
    console.warn('Failed to upgrade session:', error);
  }
}
