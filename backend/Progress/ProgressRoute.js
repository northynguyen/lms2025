import express from "express";
import { createProgressHandler, updateProgressHandler, getProgressHandler, completeCourseHandler } from "./ProgressController.js";

const router = express.Router();

router.post("/", createProgressHandler);
router.put("/:progressId", updateProgressHandler);
router.get("/:userId/:courseId", getProgressHandler);
router.post("/:progressId/complete", completeCourseHandler);

export default router;
