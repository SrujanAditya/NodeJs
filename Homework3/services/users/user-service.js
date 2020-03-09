const { userModal } = require('../../modals/users/user-modal');
const { userGroupModal } = require('../../modals/users/user-group-modal');
const op = require('sequelize').Op;
const db = require('./../../data-access/models/index');
const bcrypt = require('bcrypt');

class UserService {
    constructor() {
        this.saltRounds = 10;
    }

    async addUser(id, login, password, age) {
        let hash;
        try {
            hash = await bcrypt.hash(password, this.saltRounds);
        } catch (err) {
            throw new Error(err);
        }
        const user = {
            id,
            login,
            password: hash,
            age,
            isDeleted: false
        };
        return await userModal.create(user);
    }

    async updateUserData(param_id, id, login, password, age) {
        let hash;
        try {
            hash = await bcrypt.hash(password, this.saltRounds);
        } catch (err) {
            throw new Error(err);
        }
        return await userModal.update(
            { id, login, password: hash, age },
            { returning: true, where: { id: param_id } }
        );
    }

    async getUsersByLogin(searchString, limit) {
        let result, err;
        await userModal.findAll({
            where: {
                login: { [op.like]: `${searchString}%` }
            },
            order: [
                ['login', 'ASC']
            ],
            limit: limit
        }).then(users => {
            result = users;
        }).catch(err => {
            err = {
                message: `Invalid Query Value`
            };
        });
        return { result, err };
    }

    async getUserLoginDetails(login, password) {
        let result;
        await userModal.findOne({
            where: { login: login }
        }).then(async (user) => {
            if (user) {
                await bcrypt.compare(password, user.password).then((data) => {
                    if (data) {
                        result = user.password;
                    } else {
                        result = false;
                    }
                }).catch(err => {
                    result = false;
                });
            } else {
                result = false;
            }
        }).catch(err => {
            result = false;
        });
        return result;
    }

    async addUsersToGroup(groupId, userIds) {
        let insertData = [];
        userIds.forEach(id => {
            insertData.push({
                userId: id,
                groupId: groupId
            });
        });
        return await db.sequelize.transaction(t => {
            return userGroupModal.bulkCreate(insertData, { transaction: t })
        });
    }
}

module.exports = new UserService();