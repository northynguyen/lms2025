import express from 'express';
import { updateSectionProgressController, getSectionProgressController } from './SectionProgressController.js';

const router = express.Router();

router.post('/update', updateSectionProgressController);
router.get('/:userId/:sectionId', getSectionProgressController);

export default router;
