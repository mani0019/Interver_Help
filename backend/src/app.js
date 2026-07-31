const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();
app.set('trust proxy', 1); // trust first proxy (Render's load balancer)


app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

const authRouter = require("../routes/auth.routes.js")
const interviewRouter = require("../routes/interview.routes.js")
authRouter.stack.forEach((layer) => {
    if (layer.route) {
        console.log(
            Object.keys(layer.route.methods),
            layer.route.path
        );
    }
});
app.post("/ping", (req, res) => {
    res.json({ message: "pong" });
});
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app