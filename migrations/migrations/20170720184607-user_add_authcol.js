'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users',
      'authenticationCode',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'authenticationCode');
  }
};
