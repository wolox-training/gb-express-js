const users = require('./controllers/users');
const auth = require('./middlewares/auth');

exports.init = (app) => {

  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], users.signup);
  app.post('/users/sessions', [], users.signin);
  app.post('/users/sessions/signout', [auth.isAuthenticated], users.signout);
  app.post('/users/sessions/renew', [auth.isAuthenticated], users.renew);
};
