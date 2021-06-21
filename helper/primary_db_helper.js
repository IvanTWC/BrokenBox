// @ts-check
// Dependencies
const database = require('../misc/database')
const bcrypt = require('bcryptjs')

/**
 * @typedef {{
 *  username : string
 *  password : string
 * }} PrimaryUser
 */

/**
 * @param {string} email 
 * @returns { Promise<PrimaryUser> }
 */
const getPrimaryUser = (email) =>  {
    return new Promise((resolve,reject) => {
        let primaryDB = database.getPrimaryDB();
        primaryDB.get(
            "SELECT username, password FROM users u WHERE u.username = ?", 
            [ email ], 
            (err, row) => {
                if(err){
                    reject(err)
                }else{
                    resolve(row)
                }
            }
        )
    })
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 */
const registerPrimaryUser = (username, password) => {
    return new Promise((resolve,reject) => {
        let primaryDB = database.getPrimaryDB();
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        primaryDB.run(
            "INSERT into users (username,password, created_time) values (?,?,datetime('now'))",
            [username,hash],
            (err,row) => {
                if(err){
                    reject(err)
                }else{
                    resolve(row)
                }
            }
        )
    })
}

module.exports = {
    getPrimaryUser : getPrimaryUser,
    registerPrimaryUser : registerPrimaryUser
}