'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('UserGroup', [{
        userId: '001',
        groupId: '001'
      },{
        userId: '002',
        groupId: '005'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UserGroup', null, {});
  }
};
