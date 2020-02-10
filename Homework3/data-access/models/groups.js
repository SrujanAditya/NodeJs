'use strict';
module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define('Groups', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
  Groups.associate = function (models) {
    Groups.belongsToMany(models.Users, { through: "UserGroup", foreignKey: 'groupId' });
  };
  return Groups;
};