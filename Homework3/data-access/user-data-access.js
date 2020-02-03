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

const updateData = async (param_id, id, login, password, age) => {
    return await userModal.update(
        { id, login, password, age },
        { returning: true, where: { id: param_id } }
    );
}

const deleteUser = async (id) => {
    return await userModal.update(
        { isDeleted: true },
        { returning: true, where: id }
    );
}

module.exports = {
    getUsers,
    createUser,
    getUserById,
    getUsersByLoginSearch,
    updateData,
    deleteUser
};