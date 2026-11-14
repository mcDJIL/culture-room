import { Router } from "express";
import { authRouter } from "./auth.js";
import { collaborationsRouter } from "./collaborations.js";
import { marketplaceRouter } from "./marketplace.js";
import { networkRouter } from "./network.js";
import { postsRouter } from "./posts.js";
import { profileRouter } from "./profile.js";
import { workshopsRouter } from "./workshops.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use(authRouter);
apiRouter.use(profileRouter);
apiRouter.use(postsRouter);
apiRouter.use(networkRouter);
apiRouter.use(workshopsRouter);
apiRouter.use(marketplaceRouter);
apiRouter.use(collaborationsRouter);
