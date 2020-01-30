const { userModal } = require('../modals/user-modal');

const createUser = () => {
    return userModal.create({
        id: "000",
        login: "admin@gmail.com",
        password: "$2b$10$wQ9iytzxUb/2QnVmOBJ3WuN9bsVgvkqG7nnoqtP5peSpJE1eTIg8y",
        age: 22,
        isDeleted: false
    });
}

module.exports = createUser;