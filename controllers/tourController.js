const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/appFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields= 'name,price,ratingsAverage';
    next();
}
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// exports.checkID = (req, res, next, val) => {
//     console.log(`ID: ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid",
//         });
//     };
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.price || !req.body.name){
//         return res.status(400).json({
//                     status: "fail",
//                     message: "Missing price or name",
//                 });
//     }
//     next();
// }

/////
exports.getAllTours = catchAsync(async (req, res, next) => {
    // Build Query
    // 1.1> filtering
    // const queryObj = {...req.query}
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // const tours = await Tour.find({ 
    //     duration: 5,
    //     difficulty: "easy",
    // });

    // 1.2> advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // console.log(queryObj)
    // console.log(queryStr)
    // console.log(JSON.parse(queryStr))
    
    // let query = Tour.find(JSON.parse(queryStr));
    
    // 2> sorting
    // if(req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ')
    //     query = query.sort(sortBy)
    // } else {
    //     query = query.sort('-createdAt')
    // }

    // 3> field limiting
    // if(req.query.fields) {
    //     const fields = req.query.fields.split(',').join(' ')
    //     query = query.select(fields)
    // } else {
    //     query = query.select('-__v')
    // }

    // 4> pagenation
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page -1) * limit

    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //     const numTours = await Tour.countDocuments();
    //     if (skip >= numTours) throw new Error("NOT EXIST PAGE");
    // };

    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagenate();
    const tours = await features.query;

    // const tours = await Tour.find()
        // .where('duration')
        // .equals(5)
        // .where('price')
        // .lt(1000);

    // Send Response
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tours = await Tour.findById(req.params.id);
    
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });

    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id);
    
    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         tour
    //     }
    // });
});


exports.createTour = catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    });

    // const newId = tours[tours.length-1].id + 1;
    // const newTour = Object.assign({id:newId}, req.body);

    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
    
    // });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
    });

    res.status(200).json({
    status: 'success',
    data: {
        tour
    }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid",
    //     });
    // };
    // res.status(204).json({
    //     status: "success",
    //     data: null
    // });
});
/////


exports.getTourStats = (async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: { 
                _id: '$maxGroupSize',
                numTours: { $sum: 1},
                numRating: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }}
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            }
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $unset: "_id" ,
            // $project: { _id: 0 },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 6
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});