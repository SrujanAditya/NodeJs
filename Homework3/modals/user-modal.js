const Sequelize = require('sequelize');

export const USER_MODAL = Sequelize.define('user', {
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