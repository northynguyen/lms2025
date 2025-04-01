import express from "express";
import { createEnrollmentHandler, updateEnrollmentStatusHandler, getEnrollmentHandler, getEnrollmentByIdHandler } from "./EnrollmentController.js";

const router = express.Router();

router.post("/", createEnrollmentHandler);
router.put("/:enrollmentId/status", updateEnrollmentStatusHandler);
router.get("/:userId/:courseId", getEnrollmentHandler);
router.get("/:enrollmentId", getEnrollmentByIdHandler);

export default router;
