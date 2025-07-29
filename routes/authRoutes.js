const express =  require('express');
const router =  express.Router();
const authPageController =  require('../controllers/authPageController');



router.get('/register',  authPageController.registrationPageContent);
router.post('/register',  authPageController.processRegistration);

router.get('/login',  authPageController.loginPageContent);
router.post('/login',  authPageController.processLogin);

router.get('/logout',  authPageController.logout);



module.exports =  router;