import { Router } from "express";
import * as controllers from "../controllers/posts.js";

const router = Router();

router.get("/", controllers.getPosts);
router.get("/prompt/:promptId", controllers.getPostsByPrompt);
router.get("/:postId", controllers.getPostById);
router.post("/", controllers.createPost);
router.put("/:postId", controllers.updatePost);
router.delete("/:postId", controllers.deletePost);

export default router;
