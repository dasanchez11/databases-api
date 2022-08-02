const express = require('express');
const router = express.Router();
const authController = require('../controllers/authenticate.controller')


router.put('/signup',authController.putSignUp)
router.post('/signin',authController.postSignIn)


module.exports = router
