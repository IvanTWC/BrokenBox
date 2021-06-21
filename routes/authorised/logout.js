// @ts-check
const express = require('express')
const session_helper = require('../../helper/session_helper')

const router = express.Router()

router.get('/', function (req, res, next) {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    session_helper.clearPrimarySession(authSession,res)

    req.session.destroy((err) => {
        res.redirect('/')
    })
})

module.exports = router;
