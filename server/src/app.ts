import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

import roleManagementRoutes from "./routes/roleManagement.routes.js";
import jobDescriptionRoutes from "./routes/jobDescription.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.use("/api/roles", roleManagementRoutes);
app.use("/api/job-descriptions", jobDescriptionRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;