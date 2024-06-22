const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/AppError");
const gloablErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const app = express();

// 1. Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//     console.log("Middleware~~");
//     next();
// });

app.use((req, res, next) => {
    req.requsetTime = new Date().toISOString();
    next();
});


// 2. Router Handlers
/////

// 3. Routers

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cannot find ${req.originalUrl} on this server!`,
    // });
    
    // const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(gloablErrorHandler);
//////
// 4. Server

module.exports = app;