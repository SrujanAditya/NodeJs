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
            login: { $like: `${loginSubString}%` }
        },
        order: [
            ['login', 'ASC']
        ],
        limit: limit
    })
}
const updateData = async (user) => {

}
module.exports = {
    getUsers,
    createUser,
    getUserById,
    getUsersByLoginSearch,
    updateData
};