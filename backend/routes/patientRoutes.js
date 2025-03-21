import express from 'express';
import { 
  getPatients, 
  getPatientById,
  getPatientByPid,
  createPatient,
  updatePatient,
  addMedication,
  deletePatient
} from '../controllers/patientController.js';
import { verifyUserToken, verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (if any)

// Protected routes - require authentication
// These routes require a valid user or admin token
router.get('/', verifyUserToken, getPatients);
router.get('/:id', verifyUserToken, getPatientById);
router.get('/pid/:pid', verifyUserToken, getPatientByPid);
router.post('/', verifyUserToken, createPatient);
router.put('/:id', verifyUserToken, updatePatient);
router.post('/:id/medications', verifyUserToken, addMedication);
router.delete('/:id', verifyAdminToken, deletePatient); // Only admins can delete patients

export default router;
