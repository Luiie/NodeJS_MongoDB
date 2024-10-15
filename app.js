const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");

const AppError = require("./utils/appError");

const gloablErrorHandler = require("./controllers/errorController");

const viewRouter = require("./routes/viewRouter");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1. Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    req.requsetTime = new Date().toISOString();
    next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(gloablErrorHandler);
app.user(compression());

// 4. Server

module.exports = app;