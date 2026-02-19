import { Router } from 'express';
import * as merchantController from '../controllers/merchant.controller';

const router = Router();

router.get('/:id', merchantController.getMerchant);
router.post('/onboard', merchantController.onboard);

export default router;
