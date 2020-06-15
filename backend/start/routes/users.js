/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group(() => {
  Route.get('/', 'UserController.index').as('users_index');
  Route.get('/:id', 'UserController.show').as('users_show').middleware('auth');
  Route.post('/', 'UserController.create').as('users_create');
  Route.put('/:id', 'UserController.update').as('users_update').middleware('auth');
  Route.delete('/:id', 'UserController.delete').as('users_delete').middleware('auth');
}).prefix('v1/users');
