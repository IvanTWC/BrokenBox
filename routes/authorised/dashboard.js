//@ts-check
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
  let products = await secondary_db_helper.getProducts(authSession.auth_user)
    
  res.render(
    'authorised/dashboard', 
    {
      username : authSession.auth_user.username,
      secondary_username : secondaryUsername,
      products : products
    }
  )
})

module.exports = router;
