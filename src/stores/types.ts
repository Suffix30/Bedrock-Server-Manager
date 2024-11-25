export interface ServerStats {
  cpu: number;
  memory: number;
  maxMemory: number;
  tps: number;
  uptime: number;
  networkIn: number;
  networkOut: number;
}

export interface Player {
  id: string;
  username: string;
  joinedAt: Date;
  lastSeen?: Date;
  ip?: string;
  ping?: number;
  permissions: string[];
  playTime: number;
}

export interface WorldBackup {
  id: string;
  name: string;
  createdAt: Date;
  size: number;
  type: 'auto' | 'manual';
}

export interface ServerConfig {
  serverName: string;
  port: number;
  maxPlayers: number;
  allowCheats: boolean;
  gameRules: Record<string, boolean | number>;
  whitelist: boolean;
  autoRestart: {
    enabled: boolean;
    schedule: string[];
  };
  backupSchedule: {
    enabled: boolean;
    interval: number;
    keepCount: number;
  };
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface ConsoleCommand {
  id: string;
  command: string;
  timestamp: Date;
  response?: string;
}

export interface AdminLog {
  id: string;
  action: string;
  admin: string;
  timestamp: Date;
  details: Record<string, any>;
}