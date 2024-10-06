const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
    console.error("ERROR, ", err);
    res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
    } else { // Programming or other unkonwn error
        console.error("ERROR, ", err);

        res.status(500).json({
            status: "ERROR",
            message: "Something went very wrong!",
            err: err
        });
    }
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldErrorDB = err => {
    const message = `Duplicate Field: ${err.keyValue.name}, use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const error = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${error.join('. ')}`;
    return new AppError(message, 400);
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.name = err.name;
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if(err.name === "CastError") error = handleCastErrorDB(error)
        if(err.code === 11000) error = handleDuplicateFieldErrorDB(error)
        if(err.name === "ValidationError") error = handleValidationErrorDB(error)
        sendErrorProd(error, res);
    }
};