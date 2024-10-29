import { Router } from "express";
import * as controllers from "../controllers/prompts.js";

const router = Router();

router.get("/", controllers.getPrompts);
// router.get("/:promptId", controllers.getPrompt);
router.post("/", controllers.createPrompt);
// router.put("/:promptId", controllers.updatePrompt);
// router.delete("/:promptId", controllers.deletePrompt);

export default router;