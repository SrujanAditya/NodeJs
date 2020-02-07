const { groupModal } = require('../../modals/groups/group-modal');
const op = require('sequelize').Op;

class GroupService {
    constructor() {
        this.saltRounds = 10;
    }

    // async getGroupsData() {
    //     let result, err;
    //     await groupModal.findAll().then(groups => {
    //         result = groups;
    //     }).catch(err => {
    //         err = {
    //             message: "Something Wrong"
    //         }
    //     });
    //     return { result, err };
    // }

    // async getGroupDataByID(id) {
    //     let group, err;
    //     await groupModal.findByPk(id).then(_group => {
    //         group = _group;
    //     }).catch(err => {
    //         err = {
    //             message: "Something Wrong"
    //         }
    //     });
    //     return { group, err };
    // }

    // async addGroup(id, name, permissions) {
    //     let result;
    //     const group = {
    //         id,
    //         name,
    //         permissions
    //     };
    //     await groupModal.create(group).then(() => {
    //         result = true;
    //     }).catch(err => {
    //         result = false;
    //     });

    //     return result;
    // }

    // async updateGroupData(param_id, id, name, permissions) {
    //     let result;
    //     await groupModal.update(
    //         { id, name, permissions },
    //         { returning: true, where: { id: param_id } }
    //     ).then(() => {
    //         result = true;
    //     }).catch(err => {
    //         result = false;
    //     });
    //     return result;
    // }

    // async deleteGroupData(id) {
    //     //delete the group and its references in other groups
    // }
}

module.exports = new GroupService();