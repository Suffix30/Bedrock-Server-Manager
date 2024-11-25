import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  ServerStats, 
  Player, 
  WorldBackup, 
  ServerConfig,
  Plugin,
  ConsoleCommand,
  AdminLog 
} from './types';

export const useMainStore = defineStore('main', () => {
  // Server Status
  const serverStatus = ref<'stopped' | 'starting' | 'running' | 'stopping'>('stopped');
  const stats = ref<ServerStats>({
    cpu: 0,
    memory: 0,
    maxMemory: 2048,
    tps: 20,
    uptime: 0,
    networkIn: 0,
    networkOut: 0
  });

  // Players
  const players = ref<Player[]>([]);
  const bannedPlayers = ref<Player[]>([]);
  const whitelist = ref<string[]>([]);

  // World Management
  const backups = ref<WorldBackup[]>([]);
  const worldSettings = ref({
    seed: '',
    gameMode: 'survival',
    difficulty: 'normal',
    spawnProtection: true
  });

  // Server Configuration
  const config = ref<ServerConfig>({
    serverName: 'Minecraft Server',
    port: 19132,
    maxPlayers: 10,
    allowCheats: false,
    gameRules: {},
    whitelist: false,
    autoRestart: {
      enabled: false,
      schedule: []
    },
    backupSchedule: {
      enabled: false,
      interval: 3600,
      keepCount: 24
    }
  });

  // Plugins and Add-ons
  const plugins = ref<Plugin[]>([]);
  const behaviorPacks = ref<string[]>([]);
  const resourcePacks = ref<string[]>([]);

  // Console and Commands
  const consoleHistory = ref<ConsoleCommand[]>([]);
  const scheduledCommands = ref<{command: string, schedule: string}[]>([]);

  // Security
  const adminLogs = ref<AdminLog[]>([]);
  const sessions = ref<{admin: string, lastActive: Date}[]>([]);

  // Computed Properties
  const onlinePlayers = computed(() => players.value.length);
  const serverLoad = computed(() => ({
    cpu: stats.value.cpu,
    memory: (stats.value.memory / stats.value.maxMemory) * 100
  }));

  // Actions
  function startServer() {
    if (serverStatus.value === 'stopped') {
      serverStatus.value = 'starting';
      // Simulate server start
      setTimeout(() => {
        serverStatus.value = 'running';
        startMetricsCollection();
      }, 2000);
    }
  }

  function stopServer() {
    if (serverStatus.value === 'running') {
      serverStatus.value = 'stopping';
      // Simulate server stop
      setTimeout(() => {
        serverStatus.value = 'stopped';
        stopMetricsCollection();
      }, 2000);
    }
  }

  let metricsInterval: NodeJS.Timer;

  function startMetricsCollection() {
    metricsInterval = setInterval(() => {
      stats.value.cpu = Math.min(100, Math.max(0, stats.value.cpu + (Math.random() * 10 - 5)));
      stats.value.memory = Math.min(stats.value.maxMemory, Math.max(200, stats.value.memory + (Math.random() * 100 - 50)));
      stats.value.tps = Math.min(20, Math.max(5, stats.value.tps + (Math.random() * 2 - 1)));
      stats.value.uptime++;
      stats.value.networkIn += Math.random() * 1024;
      stats.value.networkOut += Math.random() * 1024;
    }, 1000);
  }

  function stopMetricsCollection() {
    if (metricsInterval) {
      clearInterval(metricsInterval);
    }
  }

  return {
    // State
    serverStatus,
    stats,
    players,
    bannedPlayers,
    whitelist,
    backups,
    worldSettings,
    config,
    plugins,
    behaviorPacks,
    resourcePacks,
    consoleHistory,
    scheduledCommands,
    adminLogs,
    sessions,

    // Computed
    onlinePlayers,
    serverLoad,

    // Actions
    startServer,
    stopServer
  };
});