import { defineStore } from 'pinia';
import { ref } from 'vue';

interface NetworkConnection {
  ip: string;
  port: number;
  protocol: 'tcp' | 'udp';
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  connectedAt: Date;
  lastActivity: Date;
  player?: string;
}

interface HistoricalDataPoint {
  timestamp: Date;
  cpu: number;
  memory: number;
  tps: number;
  networkIn: number;
  networkOut: number;
  players: number;
}

export const useMonitoringStore = defineStore('monitoring', () => {
  // Current connections
  const activeConnections = ref<NetworkConnection[]>([]);
  
  // Historical data (last 24 hours, 1 point per minute = 1440 points)
  const historicalData = ref<HistoricalDataPoint[]>([]);
  
  // Network statistics
  const networkStats = ref({
    totalBytesIn: 0,
    totalBytesOut: 0,
    bytesInPerSecond: 0,
    bytesOutPerSecond: 0,
    activeConnections: 0,
    peakConnections: 0,
    bannedIPs: new Set<string>(),
    suspiciousIPs: new Map<string, number>() // IP -> suspicious activity count
  });

  // Keep last 24 hours of data (1440 minutes)
  const MAX_HISTORY_POINTS = 1440;

  function addDataPoint(point: Omit<HistoricalDataPoint, 'timestamp'>) {
    historicalData.value.push({
      ...point,
      timestamp: new Date()
    });

    // Remove old data points
    if (historicalData.value.length > MAX_HISTORY_POINTS) {
      historicalData.value = historicalData.value.slice(-MAX_HISTORY_POINTS);
    }
  }

  function addConnection(connection: Omit<NetworkConnection, 'connectedAt' | 'lastActivity'>) {
    const newConnection: NetworkConnection = {
      ...connection,
      connectedAt: new Date(),
      lastActivity: new Date(),
      bytesIn: 0,
      bytesOut: 0,
      packetsIn: 0,
      packetsOut: 0
    };

    activeConnections.value.push(newConnection);
    networkStats.value.activeConnections = activeConnections.value.length;
    networkStats.value.peakConnections = Math.max(
      networkStats.value.peakConnections,
      networkStats.value.activeConnections
    );
  }

  function updateConnection(ip: string, updates: Partial<NetworkConnection>) {
    const connection = activeConnections.value.find(c => c.ip === ip);
    if (connection) {
      Object.assign(connection, {
        ...updates,
        lastActivity: new Date()
      });

      // Update network totals
      if (updates.bytesIn) {
        networkStats.value.totalBytesIn += updates.bytesIn;
      }
      if (updates.bytesOut) {
        networkStats.value.totalBytesOut += updates.bytesOut;
      }
    }
  }

  function removeConnection(ip: string) {
    activeConnections.value = activeConnections.value.filter(c => c.ip !== ip);
    networkStats.value.activeConnections = activeConnections.value.length;
  }

  function markIPSuspicious(ip: string) {
    const count = (networkStats.value.suspiciousIPs.get(ip) || 0) + 1;
    networkStats.value.suspiciousIPs.set(ip, count);

    // Auto-ban after 3 suspicious activities
    if (count >= 3) {
      networkStats.value.bannedIPs.add(ip);
      removeConnection(ip);
    }
  }

  function banIP(ip: string) {
    networkStats.value.bannedIPs.add(ip);
    removeConnection(ip);
  }

  function unbanIP(ip: string) {
    networkStats.value.bannedIPs.delete(ip);
  }

  function isIPBanned(ip: string): boolean {
    return networkStats.value.bannedIPs.has(ip);
  }

  // Clean up old connections
  setInterval(() => {
    const now = new Date();
    activeConnections.value = activeConnections.value.filter(conn => {
      const timeSinceLastActivity = now.getTime() - conn.lastActivity.getTime();
      return timeSinceLastActivity < 300000; // 5 minutes timeout
    });
    networkStats.value.activeConnections = activeConnections.value.length;
  }, 60000); // Check every minute

  return {
    activeConnections,
    historicalData,
    networkStats,
    addDataPoint,
    addConnection,
    updateConnection,
    removeConnection,
    markIPSuspicious,
    banIP,
    unbanIP,
    isIPBanned
  };
});