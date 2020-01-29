const { connection } = require('../connection/sequelize-connection');
const Sequelize = require('sequelize');

module.exports.USER_MODAL = connection.define('user', {
    id: {
        type: Sequelize.STRING,
        allowNull:false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});
