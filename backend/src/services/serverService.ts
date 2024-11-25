import { spawn } from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';

interface ServerConfig {
  serverName: string;
  port: number;
  maxPlayers: number;
  allowCheats: boolean;
}

interface Player {
  username: string;
  xuid: string;
  joinTime: Date;
}

export class ServerService extends EventEmitter {
  private serverProcess: any;
  private config: ServerConfig;
  private players: Map<string, Player>;
  private status: 'stopped' | 'starting' | 'running' | 'stopping';

  constructor() {
    super();
    this.players = new Map();
    this.status = 'stopped';
    this.config = {
      serverName: 'Minecraft Server',
      port: 19132,
      maxPlayers: 10,
      allowCheats: false
    };
  }

  async start() {
    if (this.status !== 'stopped') {
      throw new Error('Server is already running or starting');
    }

    this.status = 'starting';
    this.emit('statusChange', this.status);

    try {
      // In a real implementation, this would start the actual Bedrock server process
      this.serverProcess = spawn('echo', ['Server started']);
      
      this.serverProcess.stdout.on('data', (data: Buffer) => {
        this.emit('log', data.toString());
      });

      this.serverProcess.stderr.on('data', (data: Buffer) => {
        this.emit('error', data.toString());
      });

      this.serverProcess.on('close', (code: number) => {
        this.status = 'stopped';
        this.emit('statusChange', this.status);
        this.emit('log', `Server process exited with code ${code}`);
      });

      this.status = 'running';
      this.emit('statusChange', this.status);
    } catch (error) {
      this.status = 'stopped';
      this.emit('statusChange', this.status);
      throw error;
    }
  }

  async stop() {
    if (this.status !== 'running') {
      throw new Error('Server is not running');
    }

    this.status = 'stopping';
    this.emit('statusChange', this.status);

    if (this.serverProcess) {
      this.serverProcess.kill();
    }

    this.status = 'stopped';
    this.emit('statusChange', this.status);
  }

  async getStatus() {
    return {
      status: this.status,
      players: this.players.size,
      config: this.config
    };
  }

  async updateConfig(newConfig: ServerConfig) {
    if (this.status === 'running') {
      throw new Error('Cannot update config while server is running');
    }
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdate', this.config);
  }

  async getPlayers() {
    return Array.from(this.players.values());
  }

  async kickPlayer(username: string) {
    if (!this.players.has(username)) {
      throw new Error('Player not found');
    }
    // In a real implementation, this would send the kick command to the server
    this.players.delete(username);
    this.emit('playerKicked', username);
  }
}