const { userModal } = require('../../modals/users/user-modal');
const { userGroupModal } = require('../../modals/users/user-group-modal');
const db = require('./../../data-access/models/index');
const bcrypt = require('bcrypt');
const logger = require('./../../loggers/winston-logger');

class UserService {
    constructor() {
        this.saltRounds = 10;
    }

    async addUser(id, login, password, age) {
        logger.info(`Method name: addUser, arguments: ${JSON.stringify(arguments)}`);
        let hash;
        try {
            hash = await bcrypt.hash(password, this.saltRounds);
        } catch (err) {
            logger.error(`Method name: addUser; Error: ${err}`);
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
        logger.info(`Method name: updateUserData, arguments: ${JSON.stringify(arguments)}`);
        let hash;
        try {
            hash = await bcrypt.hash(password, this.saltRounds);
        } catch (err) {
            logger.error(`Method name: updateUserData; Error: ${err}`);
            throw new Error(err);
        }
        return await userModal.update(
            { id, login, password: hash, age },
            { returning: true, where: { id: param_id } }
        );
    }

    async getUserLoginDetails(login, password) {
        logger.info(`Method name: getUserLoginDetails, arguments: ${JSON.stringify(arguments)}`);
        const user = await userModal.findOne({
            where: { login: login }
        });
        if (user) {
            return await bcrypt.compare(password, user.password);
        } else {
            logger.error(`Method name: getUserLoginDetails; Error: ${err}`);
            throw new Error("Invalid Login id and password entered");
        }
    }

    async addUsersToGroup(groupId, userIds) {
        logger.info(`Method name: addUsersToGroup, arguments: ${JSON.stringify(arguments)}`);
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