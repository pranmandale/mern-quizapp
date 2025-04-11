
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: "sessions",
        }),
        cookie: {
            httpOnly: true,
            maxAge: 10 * 60 * 1000, // 10 minutes
            secure: process.env.NODE_ENV === "production", // must be true in production (with HTTPS)
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // use None if frontend is on different domain
        },
    })
);



import userRouter from "./routes/user.routes.js";
import quizRouter from "./routes/quiz.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/quizzes", quizRouter);

// Root route
app.get("/", (req, res) => {
    res.send("API WORKING");
});


export { app };
