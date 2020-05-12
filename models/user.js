const {Sequelize, DataTypes} = require('sequelize');
const DB_config = require('../DB_config.js');


const db = DB_config.sequelize

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    email: {
        type: String
    },
    pw: {
        type: String
    },
    registered: {
        type: DataTypes.INTEGER,
    },

},{
    timestamps: false
})

module.exports = User;








