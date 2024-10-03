const path = require("path");
const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const gloablErrorHandler = require("./controllers/errorController");

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

// 3. Routes
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Luiie'
    });
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(gloablErrorHandler);

// 4. Server

module.exports = app;