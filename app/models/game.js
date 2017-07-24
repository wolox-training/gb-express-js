const Sequelize = require('sequelize');

exports.getModel = (db) => {
  return db.define('game', {
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
  });
};
