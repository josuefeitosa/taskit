import Route from '@ioc:Adonis/Core/Route';

import UsersController from 'App/Controllers/Http/UsersController';
const usersController = new UsersController();

const userRoutes = Route.group(() => {
  Route.get('/', usersController.index).as('users_index');

  Route.post('/', usersController.create).as('users_create');
})
  .prefix('/v1/users')
  .namespace('Users');

export default userRoutes;
