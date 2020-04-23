const express = require('express');
const router = express.Router();
const { body,validationResult,sanitizeBody,check } = require('express-validator');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        subtitle: "This is what you do! or don't do 😉",
    });
});


module.exports = router;