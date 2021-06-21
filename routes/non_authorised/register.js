//@ts-check
const express = require('express')
const router = express.Router()
const primary_db_helper = require('../../helper/primary_db_helper')

router.get('/', function (req, res, next) {
    /** @type import('./login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    authSession.register_error = undefined
    authSession.register_username = undefined

    res.render('non_authorised/register', {
        error: undefined,
        username: undefined
    })
})


router.get('/error', function (req, res, next) {
    /** @type import('./login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    if (authSession.register_error == undefined) {
        res.redirect('/register')
    }

    res.render('register', {
        error: authSession.register_error,
        username: authSession.register_username
    })
})


router.post('/', async (req, res, next) => {
    /** @type import('./login').AuthSession */
    // @ts-ignore
    let authSession = req.session

    let username = req.body.username.trim()
    let password = req.body.password
    let passwordConfirm = req.body.confirm_password

    if (password != passwordConfirm) {
        authSession.register_error = 'Password does not match'
        authSession.register_username = ''
        res.redirect('/register/error')
        return
    }

    let validation = username != "" && username != undefined

    if (validation) {
        var user = await primary_db_helper.getPrimaryUser(username)

        if (user == undefined) {
            authSession.register_error = undefined

            // Register primary user
            await primary_db_helper.registerPrimaryUser(username, password)
            let user = await primary_db_helper.getPrimaryUser(username)
            authSession.auth_user = user;

            res.redirect('/dashboard')
            return
        }
    }

    authSession.register_error = 'Email exists'
    res.redirect('/register/error')
})

module.exports = router;
