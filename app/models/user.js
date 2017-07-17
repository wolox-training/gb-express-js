const Sequelize = require('sequelize');

exports.getModel = (db) => {
  return db.define('user', {
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
  });
};
