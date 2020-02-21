'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', [{
      id: '001',
      name: 'admin',
      permissions: ['READ','WRITE','DELETE','SHARE','UPLOAD_FILES']
    }, {
      id: '002',
      name: 'read_only',
      permissions: ['READ']
    }, {
      id: '003',
      name: 'read_write',
      permissions: ['READ','WRITE']
    }, {
      id: '004',
      name: 'read_write_delete',
      permissions: ['READ','WRITE','DELETE']
    },{
      id: '005',
      name: 'read_write_delete_share',
      permissions: ['READ','WRITE','DELETE','SHARE']
    },{
      id: '006',
      name: 'upload_rights',
      permissions: ['UPLOAD_FILES']
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Groups', null, {});
  }
};
