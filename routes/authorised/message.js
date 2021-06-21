// @ts-check
// Dependencies
const express = require('express')
const secondary_db_helper = require('../../helper/secondary_db_helper')
const session_helper = require('../../helper/session_helper')

const router = express.Router()

router.get('/*', async (req, res, next) => {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session
    let secondaryUsername = session_helper.getSecondaryUsernameFromReq(req)
    let messages = await secondary_db_helper.getMessages(authSession.auth_user)

    res.render(
        'authorised/message',
        {
            username: authSession.auth_user.username,
            secondary_username : secondaryUsername,
            messages: messages
        }
    )
})

router.post('/', async (req, res, next) => {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session
    let secondaryUsername = session_helper.getSecondaryUsernameFromReq(req)

    let newMessage = req.body.message
    let username = req.body.username

    await secondary_db_helper.addMessage(authSession.auth_user, username, newMessage)
    let messages = await secondary_db_helper.getMessages(authSession.auth_user)

    res.render(
        'authorised/message',
        {
            username: authSession.auth_user.username,
            secondary_username : secondaryUsername,
            messages: messages
        }
    )
})

module.exports = router;
