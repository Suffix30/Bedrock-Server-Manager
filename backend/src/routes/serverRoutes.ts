import { Router } from 'express';
import { ServerController } from '../controllers/serverController';

const router = Router();
const controller = new ServerController();

router.get('/status', controller.getStatus);
router.post('/config', controller.updateConfig);
router.get('/players', controller.getPlayers);

export default router;