import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import { env } from "./config/env.js";
import userRoutes from "./routes/user.js";
import donationRoutes from "./routes/donation.js";
import eventRoutes from "./routes/event.js";
import programRoutes from "./routes/program.js";
import resourceRoutes from "./routes/resource.js";
import storyRoutes from "./routes/story.js";
import uploadRoutes from "./routes/upload.js";
import volunteerRoutes from "./routes/volunteer.js";
import contactRoutes from "./routes/contact.js";
import newsletterRoutes from "./routes/newsletter.js";
import articleRoutes from "./routes/article.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";

const app: Application = express();

/* --- Middlewares --- */
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* --- Routes --- */
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to CloNG API 🚀" });
});

app.get("/favicon.ico", (_req, res) => res.status(204).end());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/blogs", articleRoutes);

/* --- API Documentation --- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* --- Error Handling --- */
app.use(notFound);
app.use(errorHandler);

export default app;
