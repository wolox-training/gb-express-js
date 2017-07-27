const user = require('./user'),
  game = require('./game'),
  match = require('./match');

exports.define = (db) => {
  user.getModel(db);
  game.getModel(db);
  match.getModel(db);
};
