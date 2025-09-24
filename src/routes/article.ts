import { Router } from "express";
import { createArticle, getArticles, getArticleBySlug, publishArticle, updateArticle, deleteArticle } from "../controllers/article.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/", authenticate, authorize("admin"), upload.single("featuredImage"), createArticle);
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.put("/:id", authenticate, authorize("admin"), updateArticle);
router.delete("/:id", authenticate, authorize("admin"), deleteArticle);
router.patch("/:id/publish", authenticate, authorize("admin"), publishArticle);

export default router;