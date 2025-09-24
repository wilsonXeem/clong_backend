import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { article } from "../models/article.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { eq, and } from "drizzle-orm";

export const createArticle = async (
  req: AuthRequest & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, slug, excerpt, content, featuredImage, type } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return next(createError("User not authenticated", 401));
    }

    if (!title || !content) {
      return next(createError("Title and content are required", 400));
    }

    // Handle image upload
    let imageUrl = featuredImage;
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer) as any;
      imageUrl = uploadResult.secure_url;
    }

    // Determine type based on endpoint if not provided
    const contentType = type || (req.baseUrl.includes('/blogs') ? 'blog' : 'article');

    const [newArticle] = await db
      .insert(article)
      .values({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        content,
        featuredImage: imageUrl,
        type: contentType,
        authorId,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: `${contentType === 'blog' ? 'Blog' : 'Article'} created successfully`,
      data: newArticle,
    });
  } catch (error) {
    console.error('Article creation error:', error);
    next(createError("Failed to create article", 500));
  }
};

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const published = req.query.published === "true";
    const contentType = req.baseUrl.includes('/blogs') ? 'blog' : 'article';

    const conditions = [eq(article.type, contentType)];
    if (published) conditions.push(eq(article.isPublished, true));

    const allArticles = await db
      .select()
      .from(article)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(article.createdAt);

    res.json({
      success: true,
      data: allArticles,
    });
  } catch (error) {
    next(createError("Failed to fetch articles", 500));
  }
};

export const getArticleBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const [foundArticle] = await db
      .select()
      .from(article)
      .where(eq(article.slug, slug));

    if (!foundArticle) {
      return next(createError("Article not found", 404));
    }

    res.json({
      success: true,
      data: foundArticle,
    });
  } catch (error) {
    next(createError("Failed to fetch article", 500));
  }
};

export const updateArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, featuredImage, type } = req.body;

    const [updatedArticle] = await db
      .update(article)
      .set({
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        type,
        updatedAt: new Date(),
      })
      .where(eq(article.id, id))
      .returning();

    if (!updatedArticle) {
      return next(createError("Article not found", 404));
    }

    res.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    next(createError("Failed to update article", 500));
  }
};

export const deleteArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [deletedArticle] = await db
      .delete(article)
      .where(eq(article.id, id))
      .returning();

    if (!deletedArticle) {
      return next(createError("Article not found", 404));
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    next(createError("Failed to delete article", 500));
  }
};

export const publishArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await db
      .update(article)
      .set({
        isPublished: true,
        publishedAt: new Date(),
      })
      .where(eq(article.id, id));

    res.json({
      success: true,
      message: "Article published successfully",
    });
  } catch (error) {
    next(createError("Failed to publish article", 500));
  }
};
