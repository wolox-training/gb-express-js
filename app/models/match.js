const Sequelize = require('sequelize');

exports.getModel = (db) => {
  return db.define('match', {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    game_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'games',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    assertions: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
};
