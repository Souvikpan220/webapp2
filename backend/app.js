import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import tiktokRoutes from "./routes/tiktok.js";
import supportRoutes from "./routes/support.js";
import { ensureStorage } from "./database/jsonStore.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
let storageReady;

function allowedOrigins() {
  const configured = [process.env.CLIENT_ORIGIN, process.env.FRONTEND_URL, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([
    ...configured,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173"
  ]);
}

const corsOptions = {
  origin(origin, callback) {
    const origins = allowedOrigins();
    if (!origin || origins.has(origin) || /\.vercel\.app$/i.test(origin)) return callback(null, true);
    console.warn("[cors] blocked origin", origin);
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: false,
  optionsSuccessStatus: 204
};

app.set("trust proxy", 1);
app.use((req, res, next) => {
  storageReady ||= ensureStorage();
  storageReady.then(() => next()).catch(next);
});
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.json({ limit: "32kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, _res, next) => {
  console.info("[api] request", req.method, req.originalUrl);
  next();
});
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    limit: 80,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, message: "Too many requests. Please slow down." }
  })
);

app.get("/api/health", (_req, res) => res.json({ ok: true, data: { service: "kaddu-api", time: new Date().toISOString(), runtime: process.env.VERCEL ? "vercel" : "node" } }));
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tiktok", tiktokRoutes);
app.use("/api/support", supportRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
