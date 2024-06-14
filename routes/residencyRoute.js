import express from 'express';
import { createResidency, getAllResidencies, getAllResidency } from '../controllers/residController.js';

const router = express.Router();

router.post("/create", createResidency)
router.get("/allres", getAllResidencies)
router.get("/:id", getAllResidency)

export {router as residencyRoute}