module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users',
      'isAdmin',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'isAdmin');
  }
};
