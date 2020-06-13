/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group(() => {
  Route.post('/', 'SessionController.authenticate').as('session_authenticate');
}).prefix('v1/sessions');
