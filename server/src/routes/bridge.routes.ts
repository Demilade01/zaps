import { Router } from 'express';
import * as bridgeController from '../controllers/bridge.controller';

const router = Router();

router.post('/inbound', bridgeController.initiateTransfer);
router.post('/confirm/:id', bridgeController.confirmTransfer);

export default router;
