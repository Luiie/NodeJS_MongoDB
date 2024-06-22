const express = require("express");
const {getAllUsers, getUser, createUsers, updateUser, deleteUser} = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post('/signup', authController.signup)

router.route('/')
    .get(getAllUsers)
    .post(createUsers);
router.route('/:id')
    .get(getUser)
    .delete(updateUser)
    .patch(deleteUser);

module.exports = router;