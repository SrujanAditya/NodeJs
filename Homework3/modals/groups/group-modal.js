const db = require('../../data-access/models/index');

// const Permissions = ['READ','WRITE','DELETE','SHARE','UPLOAD_FILES'];

const GROUP_MODAL = db.sequelize.define('Groups', {
    id: {
        type: db.Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    permissions: {
        type: db.Sequelize.ARRAY(db.sequelize.STRING),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    groupModal: GROUP_MODAL
}
