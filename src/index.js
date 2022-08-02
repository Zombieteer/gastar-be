require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const errors = require("./errors");
const middlewares = require("./middlewares");
const router = require("./router");
const db = require("./utils/db");
const services = require("./services");

middlewares.wrapExpressMiddleWare();

const startServer = async () => {
  const iocContainer = {
    express,
    db,
    errors,
    middlewares,
    router,
    services,
  };

  app.use(express.json({ limit: "50mb" }));
  //   app.use(cors({ credentials: true, origin: config.get('FRONTEND_HOST') }));
  app.use(cookieParser());
  app.use(middlewares.logger(false));
  app.get("/ping", async (_req, res) => res.end("pong"));
  app.use(middlewares.attachUserToRequest(iocContainer));
  app.use(router(iocContainer));
  app.use(middlewares.errorHandler("MAIN_SERVER"));

  const PORT = process.env.SERVER_PORT || 3003;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();
