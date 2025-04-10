import express from "express";
import { createEnrollmentHandler, updateEnrollmentStatusHandler, getEnrollmentHandler, getEnrollmentByIdHandler } from "./EnrollmentController.js";
import { authenticateUser } from "../MiddleWare/AuthMiddleware.js";
const router = express.Router();

router.post("/", authenticateUser, createEnrollmentHandler);
router.put("/:enrollmentId/status", updateEnrollmentStatusHandler);
router.get("/", authenticateUser, getEnrollmentHandler);
router.get("/:enrollmentId", getEnrollmentByIdHandler);

export default router;
