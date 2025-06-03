'use strict' 

// level 0

// const config = {
//     app: {
//         port: 3000   
//     },
//     db: {
//         host: 'localhost', 
//         port: 27017, 
//         name: 'db'
//     }
// }

// level 1

const dev = {
    app: {
        port: process.env.DEV_PORT || 3005,
    }, 
    db: {
        host: process.env.DEV_HOST || '0.0.0.0', 
        port: process.env.DEV_PORT || 27017, 
        name: process.env.DEV_NAME || 'shopDev'
    }
}
const prod = {
    app: {
        port: process.env.PROD_PORT || 3005,
    }, 
    db: {
        host: process.env.PROD_HOST || '0.0.0.0', 
        port: process.env.PROD_PORT || 27017, 
        name: process.env.PROD_NAME || 'lond5'
    }
}

const config = { dev, prod }

const env = process.env.NODE_ENV || 'dev'
module.exports = config[env] || dev