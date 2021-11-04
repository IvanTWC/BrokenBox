// @ts-check
// Dependencies
const express = require('express')
const secondary_db_helper = require('../../helper/secondary_db_helper')

const router = express.Router()

router.get('/', async (req, res, next) => {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session
    
    res.render(
        'authorised/login_internal',
        {
            username: authSession.auth_user.username,
            secondary_username : undefined,
            error: undefined
        }
    )
})

router.get('/error', function (req, res, next) {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session;

    if (authSession.auth_secondary_error == undefined) {
        res.redirect('/authorised/login_internal')
    }

    res.render('authorised/login_internal', {
        username: authSession.auth_user.username,
        error: authSession.auth_secondary_error,
        secondary_username : undefined
    })
})

router.post('/', async (req, res, next) => {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    let username = req.body.username.trim()
    let password = req.body.password

    let validation = username != "" && username != undefined && username != null;

    if (validation) {
        let secondaryUser = await secondary_db_helper.getSecondaryUser(authSession.auth_user, username, password)

        if (secondaryUser != undefined) {
            authSession.auth_secondary_error = undefined
            authSession.auth_secondary_error_username = undefined
            
            res.cookie('auth', secondaryUser.username)
            res.redirect('/dashboard')
            return;
        }
    }

    authSession.auth_secondary_error = 'Authentication failed';
    authSession.auth_secondary_error_username = username;
    res.redirect('/login_internal/error')
})

module.exports = router;
