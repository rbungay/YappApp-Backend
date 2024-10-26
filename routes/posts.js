import { Router } from "express";
import * as controllers from "../controllers/posts.js";

const router = Router();

router.get("/", controllers.getPosts);

export default router;
