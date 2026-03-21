import { Router } from 'express';
import { createCase, getCaseByCaseId, getCases, updateCaseStatus } from '../controllers/caseController.js';

const router = Router();

router.post('/', createCase);
router.get('/', getCases);
router.get('/:caseId', getCaseByCaseId);
router.patch('/:caseId', updateCaseStatus);

export default router;
