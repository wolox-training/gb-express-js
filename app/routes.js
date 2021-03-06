const users = require('./controllers/users'),
  games = require('./controllers/games'),
  matches = require('./controllers/matches'),
  auth = require('./middlewares/auth');

exports.init = (app) => {

  // User
  app.get('/users', [auth.isAuthenticated], users.list);
  app.post('/users', [], users.signup);
  app.post('/users/sessions', [], users.signin);
  app.post('/users/sessions/signout', [auth.isAuthenticated], users.signout);
  app.post('/users/sessions/renew', [auth.isAuthenticated], users.renew);
  app.post('/admin/users', [auth.isAuthenticated, auth.isAdmin], users.createAdmin);
  app.get('/users/:user_id/matches/emailSummary', [auth.isAuthenticated], matches.sendMailOfUserHistory);

  // Game
  app.post('/games', [auth.isAuthenticated, auth.isAdmin], games.createGame);
  app.get('/games', [auth.isAuthenticated], games.list);

  // Match
  app.post('/games/:game_id/match', [auth.isAuthenticated], matches.createMatch);
  app.get('/games/:game_id/match', [auth.isAuthenticated], matches.getMatchHistory);

};
