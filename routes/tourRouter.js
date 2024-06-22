const express = require("express");
// const {getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours} = require("./../controllers/tourController");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);
router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);


router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);
router.route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour)
    .patch(tourController.updateTour);

module.exports = router;