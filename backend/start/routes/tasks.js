/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group(() => {
  Route.get('/', 'TaskController.index').as('tasks_index');
  Route.get('/:id', 'TaskController.show').as('tasks_show').middleware('auth');
  Route.post('/', 'TaskController.create').as('tasks_create').middleware('auth');
  Route.put('/:id', 'TaskController.update').as('tasks_update').middleware('auth');
  Route.delete('/:id', 'TaskController.delete').as('tasks_delete').middleware('auth');
}).prefix('v1/tasks');
