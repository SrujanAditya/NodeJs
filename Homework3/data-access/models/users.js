'use strict';
module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		isDeleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		timestamps: false,
		freezeTableName: true
	});
	Users.associate = function (models) {
		Users.belongsToMany(models.Groups, { through: "UserGroup", foreignKey: 'userId' });
	};
	return Users;
};