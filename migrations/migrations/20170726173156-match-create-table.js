'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'match',
      {
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        game_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'games',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        assertions: {
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
    queryInterface.dropTable('match');
  }
};
