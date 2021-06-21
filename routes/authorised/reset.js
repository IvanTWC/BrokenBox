//@ts-check
const express = require('express')
const secondary_db_helper = require('../../helper/secondary_db_helper')
const router = express.Router()

router.get('/', function (req, res, next) {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    secondary_db_helper.reset(authSession.auth_user)

    res.redirect('/')
})

module.exports = router
