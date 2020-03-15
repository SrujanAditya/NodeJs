const { userModal } = require('../../modals/users/user-modal');
const { userGroupModal } = require('../../modals/users/user-group-modal');
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

    async getUserLoginDetails(login, password) {
        const user = await userModal.findOne({
            where: { login: login }
        });
        if (user) {
            return await bcrypt.compare(password, user.password);
        } else {
            throw new Error("Invalid Login id and password entered");
        }
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