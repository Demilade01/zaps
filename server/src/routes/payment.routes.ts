import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/create', paymentController.createPayment);
router.get('/:id', paymentController.getPaymentStatus);

export default router;
