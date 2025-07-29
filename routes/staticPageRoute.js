const express =  require('express');
const router =  express.Router();
const staticPageController =  require('../controllers/staticPageController');



router.get('/',  staticPageController.indexPage);
router.get('/home',  staticPageController.homePageContent);
router.get('/about',  staticPageController.aboutPageContent);
router.get('/contact',  staticPageController.contactPageContent);



module.exports =  router;