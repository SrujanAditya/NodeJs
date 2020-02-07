const db = require('../../data-access/models/index');

const USER_MODAL = db.sequelize.define('Users', {
    id: {
        type: db.Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    login: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    userModal: USER_MODAL
}
