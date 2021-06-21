//@ts-check
/** 
 * @param {import("../routes/non_authorised/login").AuthSession} authSession 
 * @param {any} res
 */
const clearPrimarySession = (authSession, res) => {
    clearSecondarySession(authSession, res)
    authSession.auth_user = undefined
}

/**
 * @param {import("../routes/non_authorised/login").AuthSession} authSession 
 * @param {any} res
 */
const clearSecondarySession = (authSession, res) => {
    authSession.auth_secondary_error = undefined
    authSession.auth_secondary_error_username = undefined

    res.clearCookie('auth')
}

/**
 * 
 * @param {*} req 
 * @returns string
 */
const getSecondaryUsernameFromReq = (req) => {
    return req.cookies['auth']
}

module.exports = {
    getSecondaryUsernameFromReq : getSecondaryUsernameFromReq,
    clearPrimarySession : clearPrimarySession,
    clearSecondarySession : clearSecondarySession
}