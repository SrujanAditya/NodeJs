const { userModal } = require('../modals/user-modal');
const op = require('sequelize').Op;

const getUsers = async () => {
    return await userModal.findAll();
}
const createUser = async (user) => {
    return await userModal.create(user);
}
const getUserById = async (id) => {
    return await userModal.findByPk(id);
}
const getUsersByLoginSearch = async (loginSubString, limit) => {
    return await userModal.findAll({
        where: {
            login: { [op.like]: `${loginSubString}%` }
        },
        order: [
            ['login', 'ASC']
        ],
        limit: limit
    })
}
// https://medium.com/@sarahdherr/sequelizes-update-method-example-included-39dfed6821d
// const updateData = async (id,login,password,) => {
//     return await userModal.update({
//         {login:}
//     })
// }
module.exports = {
    getUsers,
    createUser,
    getUserById,
    getUsersByLoginSearch,
    // updateData
};