const { getUsers, createUser, getUserById, getUsersByLoginSearch, updateData, deleteUser } = require('../data-access/user-data-access');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const getUsersData = async () => {
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

const getUserDataByID = async (id) => {
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

const addUser = async (id, login, password, age) => {
    let result;
    await bcrypt.hash(password, saltRounds).then(async (hash) => {
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

const updateUserData = async (param_id, id, login, password, age) => {
    let result;
    await bcrypt.hash(password, saltRounds).then(async (hash) => {
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

const deleteUserData = async (id) => {
    let result;
    await deleteUser(id).then(() => {
        result = true;
    }).catch(err => {
        result = false;
    });
    return result;
}

const getUsersByLogin = async (searchString, limit) => {
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
module.exports = {
    getUsersData,
    getUserDataByID,
    addUser,
    updateUserData,
    getUsersByLogin,
    deleteUserData
}