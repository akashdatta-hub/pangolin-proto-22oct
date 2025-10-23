/**
 * Microsoft Clarity Analytics Wrapper
 * Type-safe wrapper for Clarity API calls
 */

export type ClarityMethod = 'event' | 'set' | 'identify' | 'consent' | 'upgrade';

// Extend Window interface for Clarity
declare global {
  interface Window {
    clarity?: (method: ClarityMethod, ...args: any[]) => void;
  }
}

/**
 * Safe wrapper for Clarity API calls
 * Prevents crashes if Clarity fails to load
 */
export function clarityCall(method: ClarityMethod, ...args: any[]): void {
  if (typeof window !== 'undefined' && window.clarity) {
    try {
      window.clarity(method, ...args);
    } catch (error) {
      console.warn('Clarity call failed:', method, error);
    }
  }
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, data?: Record<string, string | number | boolean>): void {
  // Set tags first if data provided
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      clarityCall('set', key, String(value));
    });
  }
  // Then fire the event
  clarityCall('event', eventName);
}

/**
 * Set a custom tag/dimension
 */
export function setTag(key: string, value: string | number | boolean): void {
  clarityCall('set', key, String(value));
}

/**
 * Identify a user (optional, for future use)
 */
export function identifyUser(userId: string, sessionId?: string, pageId?: string): void {
  clarityCall('identify', userId, sessionId, pageId);
}

/**
 * Upgrade session priority (for important events like errors)
 */
export function upgradeSession(reason: string): void {
  clarityCall('upgrade', reason);
}
