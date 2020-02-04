const Sequelize = require('sequelize');
const connection = require('../../connection/sequelize-connection');

const USER_MODAL = connection.define('users', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
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
},{
    timestamps:false,
    freezeTableName: true
});

module.exports = {
    userModal:USER_MODAL
}
