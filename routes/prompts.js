import { Router } from "express";
import * as controllers from "../controllers/prompts.js";

const router = Router();

router.get("/", controllers.getPrompts);
router.post("/", controllers.createPrompt);
router.get("/today", controllers.getTodayPrompt);
router.get("/previous", controllers.getPreviousPrompts);

// router.get("/:promptId", controllers.getPrompt);

// router.put("/:promptId", controllers.updatePrompt);
// router.delete("/:promptId", controllers.deletePrompt);

export default router;
