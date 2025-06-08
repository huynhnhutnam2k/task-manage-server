const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

//#region init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://task-manage-gilt.vercel.app/"]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000", // Add this
        "http://127.0.0.1:5173", // Add this
      ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies if needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "client_id"],
  })
);
//#endregion

//#region init db
require("./database/init.mongodb");
//#endregion

//#region init routers
app.use("/", require("./routes"));
//#endregion

app.use((req, res, next) => {
  const error = new Error("Error");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Interval server error";
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

module.exports = app;
