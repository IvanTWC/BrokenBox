// @ts-check
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    /** @type import('./login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    if (authSession.auth_user) {
        res.redirect('/dashboard')
    } else {
        res.render('non_authorised/index')
    }
})

module.exports = router;
