// @ts-check
const express = require('express')
const bcrypt = require('bcryptjs')
const primary_db_helper = require('../../helper/primary_db_helper')

const router = express.Router()

/**
 * @typedef {{
 *  auth_error : string,
 *  auth_error_username : string,
 *  auth_user : import('../../helper/primary_db_helper').PrimaryUser,
 *  register_error : string,
 *  register_username : string,
 *  auth_secondary_error : string,
 *  auth_secondary_error_username : string,
 * }} AuthSession
 */
router.get('/', function (req, res, next) {
    /** @type AuthSession */
    // @ts-ignore
    let authSession = req.session

    if (authSession.auth_user) {
        res.redirect('/dashboard')
    } else {
        authSession.auth_error = undefined;
        res.render('non_authorised/login', {
            error: undefined,
            username: undefined
        })
    }
})

router.get('/error', function (req, res, next) {
    /** @type AuthSession */
    // @ts-ignore
    let authSession = req.session;

    if (authSession.auth_error == undefined) {
        res.redirect('/login')
    }

    res.render('non_authorised/login', {
        error: authSession.auth_error,
        username: authSession.auth_error_username
    })
})

router.post('/', async (req, res, next) => {
    /** @type AuthSession */
    // @ts-ignore
    let authSession = req.session

    let username = req.body.username.trim()
    let password = req.body.password

    let validation = username != "" && username != undefined && username != null;

    if (validation) {
        let user = await primary_db_helper.getPrimaryUser(username)

        if (user != undefined) {
            if (bcrypt.compareSync(password, user.password)) {
                authSession.auth_user = user;

                authSession.auth_error_username = undefined;
                authSession.auth_error = undefined;

                res.redirect('/dashboard')
                return;
            }
        }
    }

    authSession.auth_error = 'Authentication failed';
    authSession.auth_error_username = username;
    res.redirect('/login/error')
})

module.exports = router;
