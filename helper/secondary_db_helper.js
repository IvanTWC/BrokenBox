// @ts-check
// Dependencies
const database = require('../misc/database')
const md5 = require('md5')

/**
 * @typedef {{
 *  username : string,
 *  password : string
 * }} SecondaryUser
 */

/**
 * @typedef {{
 *  id : number,
 *  name : string,
 *  price : number,
 *  description : string,
 *  image : string
 * }} Product
 */

/**
 * @typedef {{
 *  id : number,
 *  username : string,
 *  message : string,
 *  created_time : string
 * }} Message
 */

/**
 * 
 * @param {import('./primary_db_helper').PrimaryUser} primary_user 
 * @returns {Promise<Array.<Product>>}
 */
const getProducts = (primary_user) => {
    return new Promise((resolve,reject) => {
        let db2 = database.getSecondaryDB(primary_user.username)

        let cmd = `SELECT id, name, price, description, image 
                FROM products p WHERE p.hidden = 0 `

        db2.all(cmd,[], (err, rows) => {
            resolve(rows)
        })
    })
}

/**
 * 
 * @param {import('./primary_db_helper').PrimaryUser} primary_user 
 * @param {string} id
 * @returns {Promise<Array.<Product>>}
 */
 const getProduct = (primary_user, id) => {
    return new Promise((resolve,reject) => {
        let db2 = database.getSecondaryDB(primary_user.username)

        /* ------------------------------- VULNERABLE ------------------------------- */
        let cmd = `SELECT id, name, price, description, image 
                FROM products p WHERE p.id = ${id} `

        db2.get(cmd,[], (err, row) => {
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
        /* ------------------------------- VULNERABLE ------------------------------- */
    })
}

/**
 * 
 * @param {import('./primary_db_helper').PrimaryUser} primary_user 
 * @returns {Promise<Array.<Message>>}
 */
 const getMessages = (primary_user) => {
    return new Promise((resolve,reject) => {
        let db2 = database.getSecondaryDB(primary_user.username)

        let cmd = `SELECT m.id, m.username, m.created_time, m.message FROM message m `

        db2.all(cmd,[], (err, rows) => {
            resolve(rows)
        })
    })
}

/**
 * 
 * @param {string} username 
 * @param {string} message 
 */
 const addMessage = (primary_user, username, message) => {
    return new Promise((resolve,reject) => {
        let db2 = database.getSecondaryDB(primary_user.username)

        let cmd = `INSERT INTO message (username, message, created_time) values (?,?,datetime('now')) `

        db2.all(cmd,[username, message], (err, rows) => {
            resolve(rows)
        })
    })
}

/**
 * @param {import('./primary_db_helper').PrimaryUser} primary_user
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<SecondaryUser>}
 */
const getSecondaryUser = (primary_user, username, password) => {
    return new Promise((resolve,reject) => {
        let db2 = database.getSecondaryDB(primary_user.username)

        let code = md5(password)
        let cmd = `SELECT username, password FROM users u WHERE u.username = ${username} AND u.password = ${code}`
        
        db2.get(cmd, (err, row) => {
            resolve(row)
        })
    })
}

/**
 * 
 * @param {import('./primary_db_helper').PrimaryUser} primary_user 
 */
const reset = (primary_user) => {
    let db2 = database.getSecondaryDB(primary_user.username)
    database.resetSecondaryDB(db2)
}

module.exports = {
    reset : reset,
    getProduct : getProduct,
    getProducts : getProducts,
    getMessages : getMessages,
    addMessage : addMessage,
    getSecondaryUser : getSecondaryUser
}