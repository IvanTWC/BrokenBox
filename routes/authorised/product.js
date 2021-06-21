//@ts-check
// Dependencies
const express = require('express')
const secondary_db_helper = require('../../helper/secondary_db_helper')
const session_helper = require('../../helper/session_helper')

const router = express.Router()

router.get('/', async (req, res, next) => {
    res.redirect('/dashboard')
})

router.get('/:id', async (req, res, next) => {
    /** @type import('../non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session
    let secondaryUsername = session_helper.getSecondaryUsernameFromReq(req)
    
    let productId = req.params.id
    if(!productId){
        res.redirect('dashboard')
    }

    let product = undefined

    try {
        product = await secondary_db_helper.getProduct(authSession.auth_user, productId)
    } catch (e) {
        /* ------------------------------ Vulnerability ----------------------------- */
        res.send(e.message + " " + e.stack)
        return
    }

    res.render(
        'authorised/product',
        {
            username: authSession.auth_user.username,
            secondary_username : secondaryUsername,
            product: product
        }
    )
})

module.exports = router;
