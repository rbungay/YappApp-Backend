import { Router } from "express";
import * as controllers from "../controllers/comments.js";

const router = Router();

router.get("/", controllers.getComments);
router.get("/:commentId", controllers.getCommentsById);
router.post("/", controllers.createComment);
router.put("/:commentId", controllers.updateComment);
router.delete("/:commentId", controllers.deleteComment);

export default router;
