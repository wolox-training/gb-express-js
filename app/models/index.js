const user = require('./user'),
  game = require('./game');

exports.define = (db) => {
  user.getModel(db);
  game.getModel(db);
};
