import { Router } from "express";
import * as controllers from "../controllers/profiles.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = Router();

router.get("/:userId", verifyToken, controllers.getUserProfile);
router.patch("/:userId/username", verifyToken, controllers.updateUserName);

export default router;
