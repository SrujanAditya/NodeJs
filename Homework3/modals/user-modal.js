const { connection } = require('../connection/sequelize-connection');
const Sequelize = require('sequelize');

const USER_MODAL = connection.define('user', {
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
}, {
    timestamps: false,
    freezeTableName: true, // Model tableName will be the same as the model name
    tableName: 'user'
});

module.exports = {
    userModal:USER_MODAL
}
