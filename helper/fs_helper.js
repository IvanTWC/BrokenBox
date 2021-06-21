const fs = require('fs')
const path = require('path')

const dbDir = './bin/db/'

// Setup required directory if missing
const createDbDirectory = () => {
    if(!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir)
    }
}

const removeExistingDb = () => {
    let files = fs.readdirSync(dbDir)
    for(let f of files){
        fs.unlinkSync(path.join(dbDir,f))
    }
}

module.exports = {
    createDbDirectory : createDbDirectory,
    removeExistingDb : removeExistingDb
}