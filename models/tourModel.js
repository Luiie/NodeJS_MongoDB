const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        maxlength: [40, "A tour name must have less or equal then 40 characters"],
        minlength: [5, "A tour name must have more or equal then 5 characters"]
    },
    slug: String,
    duration : {
        type: Number,
        required: [true, "A tour must have a duration"],
    },
    maxGroupSize : {
        type: Number,
        required: [true, "A tour must have a group size"],
    },
    difficulty : {
        type: String,
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "select one among easy, medium, or difficult"
        },
    },
    ratingsAverage : {
        type: Number,
        default: 4.5,
        maxlength: [1, "Rating must be above 1.0"],
        minlength: [5, "Rating must be under 5.0"]
    },
    ratingsQuantity : {
        type: Number,
        default: 0
    },
    price : {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: "Not valid discount price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover : {
        type: String
    },
    images : [String],
    createdAt : {
        type: Date,
        default : Date.now()
    },
    startDates : [Date],
    secreteTour : {
        type: Boolean,
        default : false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tourSchema.pre("save", function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

tourSchema.pre("aggregate", function(next) {
    this.pipline().unshift({ $match: { secreteTour: {$ne: true}} });
    next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;