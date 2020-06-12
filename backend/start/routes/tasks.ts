import Route from '@ioc:Adonis/Core/Route';

import TasksController from 'App/Controllers/Http/TasksController';
const tasksController = new TasksController();

const taskRoutes = Route.group(() => {})
  .prefix('/v1/tasks')
  .namespace('Tasks');
