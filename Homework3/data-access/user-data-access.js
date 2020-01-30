const { userModal } = require('../modals/user-modal');

const getUsers = async () => {
    return await userModal.findAll();
}
const createUser = async (user) => {
    return await userModal.create(user);
}
const getUserById = async (id) => {
    return await userModal.findByPk(id)
}

module.exports = { getUsers, createUser, getUserById };