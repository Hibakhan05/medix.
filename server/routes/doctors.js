import { Router } from 'express';
import { listDoctors, getDoctor } from '../controllers/doctorController.js';
import { protect } from '../middleware/auth.js';
const r = Router();
r.use(protect);
r.get('/', listDoctors);
r.get('/:id', getDoctor);
export default r;
