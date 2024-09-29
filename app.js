const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const gloablErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const app = express();

// 1. Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requsetTime = new Date().toISOString();
    next();
});

// 3. Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(gloablErrorHandler);

// 4. Server

module.exports = app;