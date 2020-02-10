'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    userId: {
      allowNull: false,
      primaryKey: true,
      type:DataTypes.STRING,
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
      type:DataTypes.STRING,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {});
  UserGroup.associate = function(models) {
    UserGroup.belongsTo(models.User, {foreignKey: 'userId'});
    UsersWorkingDay.belongsTo(models.Group, {foreignKey: 'groupId'});
  };
  return UserGroup;
};