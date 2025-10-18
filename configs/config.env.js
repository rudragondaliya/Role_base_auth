
require('dotenv').config();

const dotenv = {
    MONGODB_URL : process.env.MONGODB_URL,
    PRIVATE_KEY : process.env.PRIVATE_KEY
}

module.exports = dotenv;
