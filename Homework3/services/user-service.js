const { getUsers, createUser, getUserById, getUsersByLoginSearch, updateData, deleteUser, getUserByLogin } = require('../data-access/user-data-access');
const bcrypt = require('bcrypt');

class UserService {
    constructor() {
        this.saltRounds = 10;
     }

    async getUsersData() {
        let result, err;
        await getUsers().then(users => {
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
        await getUserById(id).then(_user => {
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
            await createUser(user).then(() => {
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
            await updateData(param_id, id, login, hash, age).then(() => {
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
        await deleteUser(id).then(() => {
            result = true;
        }).catch(err => {
            result = false;
        });
        return result;
    }

    async getUsersByLogin(searchString, limit) {
        let result, err;
        await getUsersByLoginSearch(searchString, limit).then(users => {
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
        await getUserByLogin(login).then(async (user) => {
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
}

module.exports = new UserService();