module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'user',
      {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          isEmail: true
        },
        password: {
          type: Sequelize.STRING,
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
    queryInterface.dropTable('user');
  }
};
