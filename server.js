const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({path: './config.env'});
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
// mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(con => {
    // console.log(con.connections);
    console.log("DB Connected!");
});


// const testTour = new Tour({
//     "name": "The Park Camper",
//     "price": 997
// });

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(`err!: ${err}`);
// });

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}!`);
});