import { defineStore } from 'pinia';
import { ref } from 'vue';

interface LoginAttempt {
  ip: string;
  timestamp: Date;
  success: boolean;
}

interface Session {
  id: string;
  userId: string;
  username: string;
  ip: string;
  userAgent: string;
  lastActive: Date;
  expiresAt: Date;
}

export const useSecurityStore = defineStore('security', () => {
  const loginAttempts = ref<LoginAttempt[]>([]);
  const activeSessions = ref<Session[]>([]);
  const blockedIPs = ref<Map<string, Date>>(new Map());

  // Brute Force Protection
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

  function recordLoginAttempt(ip: string, success: boolean) {
    loginAttempts.value.push({
      ip,
      timestamp: new Date(),
      success
    });

    // Clean up old attempts
    const cutoff = new Date(Date.now() - ATTEMPT_WINDOW);
    loginAttempts.value = loginAttempts.value.filter(
      attempt => attempt.timestamp > cutoff
    );

    // Check for brute force
    if (!success) {
      const recentAttempts = loginAttempts.value.filter(
        attempt => attempt.ip === ip && !attempt.success
      );

      if (recentAttempts.length >= MAX_ATTEMPTS) {
        blockIP(ip);
      }
    }
  }

  function blockIP(ip: string) {
    blockedIPs.value.set(ip, new Date(Date.now() + BLOCK_DURATION));
  }

  function unblockIP(ip: string) {
    blockedIPs.value.delete(ip);
  }

  function isIPBlocked(ip: string): boolean {
    const blockExpiry = blockedIPs.value.get(ip);
    if (!blockExpiry) return false;

    if (blockExpiry > new Date()) {
      return true;
    } else {
      blockedIPs.value.delete(ip);
      return false;
    }
  }

  function getFailedAttempts(ip: string): number {
    const cutoff = new Date(Date.now() - ATTEMPT_WINDOW);
    return loginAttempts.value.filter(
      attempt => attempt.ip === ip && !attempt.success && attempt.timestamp > cutoff
    ).length;
  }

  function getRecentAttempts(): LoginAttempt[] {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    return loginAttempts.value
      .filter(attempt => attempt.timestamp > cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Session Management
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function createSession(userId: string, username: string, ip: string, userAgent: string): Session {
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      username,
      ip,
      userAgent,
      lastActive: new Date(),
      expiresAt: new Date(Date.now() + SESSION_DURATION)
    };

    activeSessions.value.push(session);
    return session;
  }

  function updateSessionActivity(sessionId: string) {
    const session = activeSessions.value.find(s => s.id === sessionId);
    if (session) {
      session.lastActive = new Date();
    }
  }

  function validateSession(sessionId: string): boolean {
    const session = activeSessions.value.find(s => s.id === sessionId);
    if (!session) return false;

    const now = new Date();
    
    if (now > session.expiresAt) {
      terminateSession(sessionId);
      return false;
    }

    const inactiveTime = now.getTime() - session.lastActive.getTime();
    if (inactiveTime > INACTIVE_TIMEOUT) {
      terminateSession(sessionId);
      return false;
    }

    updateSessionActivity(sessionId);
    return true;
  }

  function terminateSession(sessionId: string) {
    activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId);
  }

  function terminateAllUserSessions(userId: string) {
    activeSessions.value = activeSessions.value.filter(s => s.userId !== userId);
  }

  function getActiveSessions(userId: string): Session[] {
    return activeSessions.value.filter(s => s.userId === userId);
  }

  // Cleanup expired sessions and blocks
  setInterval(() => {
    const now = new Date();

    // Clean up expired sessions
    activeSessions.value = activeSessions.value.filter(session => {
      const inactiveTime = now.getTime() - session.lastActive.getTime();
      return session.expiresAt > now && inactiveTime <= INACTIVE_TIMEOUT;
    });

    // Clean up expired IP blocks
    for (const [ip, expiry] of blockedIPs.value.entries()) {
      if (expiry <= now) {
        blockedIPs.value.delete(ip);
      }
    }
  }, 60000); // Check every minute

  return {
    // Brute Force Protection
    recordLoginAttempt,
    isIPBlocked,
    blockIP,
    unblockIP,
    getFailedAttempts,
    getRecentAttempts,
    
    // Session Management
    createSession,
    validateSession,
    terminateSession,
    terminateAllUserSessions,
    getActiveSessions,
    updateSessionActivity,
    blockedIPs
  };
});