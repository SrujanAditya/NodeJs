const { getUsers, createUser, getUserById, getUsersByLoginSearch } = require('../data-access/user-data-access');
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
            result = {
                status: 200,
                message: `User with id ${id} created successfully`
            };
        }).catch(err => {
            result = {
                status: 500,
                message: `User with id ${id} already exist`
            };
        });
    });
    return result;
}

const updateUserData = async (id, login, password, age) => {

}

const getUsersByLogin = async (searchString, limit) => {
    let result;
    await getUsersByLoginSearch(searchString, limit).then(users => {
        result = {
            status: 200,
            message: users
        }
    }).catch(err => {
        result = {
            status: 500,
            err: err,
            message: `Invalid Query Value`
        }
    });
    return result;
}
module.exports = {
    getUsersData,
    getUserDataByID,
    addUser,
    updateUserData,
    getUsersByLogin
}