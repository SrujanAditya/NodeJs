'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: '001',
      login: 'admin@gmail.com',
      password: '$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga',
      age:22,
      isDeleted: false
    },{
      id: '002',
      login: 'samp@gmail.com',
      password: '$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga',
      age:23,
      isDeleted: false
    },{
      id: '003',
      login: 'temp@gmail.com',
      password: '$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga',
      age:26,
      isDeleted: false
    },{
      id: '004',
      login: 'client@gmail.com',
      password: '$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga',
      age:30,
      isDeleted: false
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
