import { Request, Response } from 'express';
import { ServerService } from '../services/serverService';
import { z } from 'zod';

const serverService = new ServerService();

const configSchema = z.object({
  serverName: z.string().min(1),
  port: z.number().min(1024).max(65535),
  maxPlayers: z.number().min(1).max(100),
  allowCheats: z.boolean()
});

export class ServerController {
  async getStatus(req: Request, res: Response) {
    try {
      const status = await serverService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get server status' });
    }
  }

  async updateConfig(req: Request, res: Response) {
    try {
      const config = configSchema.parse(req.body);
      await serverService.updateConfig(config);
      res.json({ message: 'Configuration updated successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update configuration' });
      }
    }
  }

  async getPlayers(req: Request, res: Response) {
    try {
      const players = await serverService.getPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get players list' });
    }
  }
}