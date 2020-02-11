const { userModal } = require('../../modals/users/user-modal');
const { userGroupModal } = require('../../modals/users/user-group-modal');
const op = require('sequelize').Op;
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');

class UserService {
    constructor() {
        this.saltRounds = 10;
    }

    async getUsersData() {
        let result, err;
        await userModal.findAll().then(users => {
            result = users;
        }).catch(err => {
            err = {
                message: "Something Wrong"
            }
        });
        return { result, err };
    }

    async getUserDataByID(id) {
        let user, err;
        await userModal.findByPk(id).then(_user => {
            user = _user;
        }).catch(err => {
            err = {
                message: "Something Wrong"
            }
        });
        return { user, err };
    }

    async addUser(id, login, password, age) {
        let result;
        await bcrypt.hash(password, this.saltRounds).then(async (hash) => {
            const user = {
                id,
                login,
                password: hash,
                age,
                isDeleted: false
            };
            await userModal.create(user).then(() => {
                result = true;
            }).catch(err => {
                result = false;
            });
        });
        return result;
    }

    async updateUserData(param_id, id, login, password, age) {
        let result;
        await bcrypt.hash(password, this.saltRounds).then(async (hash) => {
            await userModal.update(
                { id, login, password, age },
                { returning: true, where: { id: param_id } }
            ).then(() => {
                result = true;
            }).catch(err => {
                result = false;
            });
        }).catch(err => {
            result = false;
        });
        return result;
    }

    async deleteUserData(id) {
        let result;
        await userModal.update(
            { isDeleted: true },
            { returning: true, where: id }
        ).then(() => {
            result = true;
        }).catch(err => {
            result = false;
        });
        return result;
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
        let result;
        let insertdata=[];
        userIds.forEach(id => {
            insertdata.push({
                userId: id,
                groupId:groupId
            })
        });
        console.log(insertdata);
        return true;
        // sequelize.transaction(){}

    }
}

module.exports = new UserService();