import { Router } from "express";
import * as controllers from "../controllers/posts.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = Router();

router.put("/:postId/vote", verifyToken, controllers.castVote); // New Route to cast vote

router.get("/", controllers.getPosts);
router.get("/prompt/:promptId", controllers.getPostsByPrompt);
router.get("/:postId", controllers.getPostById);
router.post("/", controllers.createPost);
router.put("/:postId", controllers.updatePost);
router.delete("/:postId", controllers.deletePost);

export default router;
