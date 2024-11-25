import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Player {
  username: string;
  joinedAt: Date;
  ping?: number;
}

interface BannedPlayer {
  username: string;
  bannedAt: Date;
  reason: string;
}

interface ServerSettings {
  serverName: string;
  serverIp: string;
  port: number;
  maxPlayers: number;
  allowCheats: boolean;
}

export const useServerStore = defineStore('server', () => {
  const serverStatus = ref<'stopped' | 'starting' | 'running' | 'stopping'>('stopped');
  const players = ref<Player[]>([]);
  const bannedPlayers = ref<BannedPlayer[]>([]);
  const logs = ref<string[]>([]);
  const settings = ref<ServerSettings>({
    serverName: 'Minecraft Server',
    serverIp: '',
    port: 19132,
    maxPlayers: 10,
    allowCheats: false,
  });

  // Server control functions
  function startServer() {
    if (serverStatus.value === 'stopped') {
      serverStatus.value = 'starting';
      // Simulate server start
      setTimeout(() => {
        serverStatus.value = 'running';
        addLog('Server started successfully');
        // Simulate some players joining
        simulatePlayerJoin();
      }, 2000);
    }
  }

  function stopServer() {
    if (serverStatus.value === 'running') {
      serverStatus.value = 'stopping';
      // Simulate server stop
      setTimeout(() => {
        serverStatus.value = 'stopped';
        players.value = [];
        addLog('Server stopped');
      }, 2000);
    }
  }

  // Player management functions
  function kickPlayer(username: string) {
    const player = players.value.find(p => p.username === username);
    if (player) {
      players.value = players.value.filter(p => p.username !== username);
      addLog(`Kicked player: ${username}`);
    }
  }

  function banPlayer(username: string, reason: string = 'No reason provided') {
    kickPlayer(username);
    bannedPlayers.value.push({
      username,
      bannedAt: new Date(),
      reason
    });
    addLog(`Banned player: ${username} (${reason})`);
  }

  function unbanPlayer(username: string) {
    bannedPlayers.value = bannedPlayers.value.filter(p => p.username !== username);
    addLog(`Unbanned player: ${username}`);
  }

  // Settings management
  function updateSettings(newSettings: Partial<ServerSettings>) {
    settings.value = { ...settings.value, ...newSettings };
    addLog('Server settings updated');
    // Save settings to localStorage
    localStorage.setItem('serverSettings', JSON.stringify(settings.value));
  }

  // Load settings from localStorage on store initialization
  const savedSettings = localStorage.getItem('serverSettings');
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings);
  }

  function addLog(message: string) {
    logs.value.unshift(`[${new Date().toISOString()}] ${message}`);
    if (logs.value.length > 100) {
      logs.value = logs.value.slice(0, 100);
    }
  }

  // Simulation helpers
  function simulatePlayerJoin() {
    const mockPlayers = ['Steve', 'Alex', 'Notch', 'Herobrine'];
    const interval = setInterval(() => {
      if (serverStatus.value !== 'running') {
        clearInterval(interval);
        return;
      }
      if (players.value.length < 2) {
        const randomPlayer = mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
        if (!players.value.find(p => p.username === randomPlayer)) {
          players.value.push({
            username: randomPlayer,
            joinedAt: new Date()
          });
          addLog(`Player joined: ${randomPlayer}`);
        }
      }
    }, 5000);
  }

  return {
    serverStatus,
    players,
    bannedPlayers,
    logs,
    settings,
    startServer,
    stopServer,
    kickPlayer,
    banPlayer,
    unbanPlayer,
    updateSettings,
    addLog
  };
});