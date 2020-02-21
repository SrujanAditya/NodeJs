const db = require('../../data-access/models/index');

const USER_GROUP_MODAL = db.sequelize.define('UserGroup', {
    userId: {
        allowNull: false,
        primaryKey: true,
        type:db.Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      groupId: {
        allowNull: false,
        primaryKey: true,
        type:db.Sequelize.STRING,
        references: {
          model: 'Groups',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    userGroupModal: USER_GROUP_MODAL
}