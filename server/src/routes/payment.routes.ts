import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/', paymentController.createPayment);
router.post('/transfer', paymentController.transfer);
router.get('/:id', paymentController.getPaymentStatus);

export default router;
