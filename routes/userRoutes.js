const express =  require('express');
const router =  express.Router();
const userPageController =  require('../controllers/userController');
const requireLogin = require('../middleware/auth');

// Apply auth middleware to all user routes
router.use(requireLogin);

router.get('/dashboard',  userPageController.userDashboard);
router.get('/user/profile',  userPageController.userProfileContent);
router.get('/user/info',  userPageController.userInfoContent);




module.exports =  router;