// @ts-check
let indexRouter = require('./routes/non_authorised/index')
let dashboardRouter = require('./routes/authorised/dashboard')
let loginRouter = require('./routes/non_authorised/login')
let registerRouter = require('./routes/non_authorised/register')
let logoutRouter = require('./routes/authorised/logout')
let resetRouter = require('./routes/authorised/reset')
let productRouter = require('./routes/authorised/product')
let messageRouter = require('./routes/authorised/message')
let loginInternalRouter = require('./routes/authorised/login_internal')
let logoutInternalRouter = require('./routes/authorised/logout_internal')

/**
 * 
 * @param {import('express').Express} app 
 */
const setupRouter = (app) => {
    app.use('/', indexRouter)
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)


    /* ---------------------------- Authorized Route ---------------------------- */
    app.use('/dashboard', _authorisedOnly, dashboardRouter)
    app.use('/product', _authorisedOnly, productRouter)
    app.use('/logout', _authorisedOnly, logoutRouter)
    app.use('/reset', _authorisedOnly, resetRouter)
    app.use('/message',_authorisedOnly, messageRouter)
    app.use('/login_internal',_authorisedOnly, loginInternalRouter)
    app.use('/logout_internal',_authorisedOnly, logoutInternalRouter)
}

const _authorisedOnly = (req,res,next) => {
    /** @type import('./routes/non_authorised/login').AuthSession */
    // @ts-ignore
    let authSession = req.session
    authSession.auth_user ? next() : res.redirect('/login')
}

module.exports = setupRouter;