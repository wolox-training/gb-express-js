module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'game',
      {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        score: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      },
      {
        engine: 'MYISAM',                     // default: 'InnoDB'
        charset: 'latin1',                    // default: null
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('game');
  }
};
