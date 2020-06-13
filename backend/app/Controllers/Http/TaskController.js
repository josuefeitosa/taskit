const User = use('App/Models/User');
const Task = use('App/Models/Task');
const Database = use('Database');
const moment = use('moment');

class TaskController {
  async index({ request, response }) {
    try {
      const userId = request.input('user_id');

      if (userId) {
        const user = await User.findOrFail(userId);

        await user.load('tasks');
        const userTasks = user.toJSON();
        delete userTasks.password;

        return response.status(200).json(userTasks);
      }

      const tasks = await Task.query().with('users').fetch();
      const tasksJSON = tasks.toJSON();

      tasksJSON.forEach(task => {
        task.term = moment(task.term).format('DD/MM/YYYY');
        task.users.forEach(user => {
          delete user.password;
          delete user.pivot;
          delete user.created_at;
          delete user.updated_at;
        });
      });

      return response.status(200).json(tasksJSON);
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async create({ request, response, auth }) {
    try {
      const ownerId = auth.user.id;
      const { title, term, teamMates, status } = request.body;

      const teamMatesUsers = await Database.from('users').whereIn(
        'id',
        teamMates,
      );

      if (teamMatesUsers.length !== teamMates.length) {
        return response.status(400).json({
          message: 'Não foi possível realizar esta operação. Tente novamente!',
          error: 'Um dos usuários não está cadastrado',
        });
      }

      const taskData = {
        title,
        term,
        owner_id: ownerId,
        status,
      };

      const createdTask = await Task.create(taskData);
      const createdTaskJSON = createdTask.toJSON();

      await Database.from('task_users').insert({
        task_id: createdTaskJSON.id,
        user_id: ownerId,
      });

      for (const teamMate of teamMatesUsers) {
        await Database.from('task_users').insert({
          task_id: createdTaskJSON.id,
          user_id: teamMate.id,
        });
      }

      return response.status(201).json({
        message: 'Tarefa criada com sucesso!',
        task: createdTaskJSON,
        teamMates,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async update({ request, response, auth, params }) {
    const userId = auth.user.id;

    const task = await Task.findOrFail(params.id);
    await task.load('users');
    const taskJSON = task.toJSON();

    const isUserInTask =
      taskJSON.users.findIndex(user => user.id === userId) ||
      taskJSON.owner_id === userId;

    if (isUserInTask === true || isUserInTask >= 0) {
      const data = request.all();
      await task.merge(data);
      await task.save();

      const updatedTask = task.toJSON();

      for (const user of updatedTask.users) {
        delete user.password;
        delete user.pivot;
        delete user.created_at;
        delete user.updated_at;
      }

      return response
        .status(200)
        .json({ message: 'Tarefa alterada com sucesso!', task: updatedTask });
    }

    return response.status(400).json({
      message: 'Não foi possível realizar esta operação. Tente novamente!',
      error: 'Você não está relacionado com esta tarefa!',
    });
  }

  async delete({ response, params, auth }) {
    try {
      const userId = auth.user.id;

      const task = await Task.findOrFail(params.id);
      const taskJSON = task.toJSON();

      if (taskJSON.owner_id !== userId)
        return response.status(400).json({
          message: 'Não foi possível realizar esta operação. Tente novamente!',
          error: 'Você não está relacionado com esta tarefa!',
        });

      await task.delete();
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async show({ response, params, auth }) {
    try {
      const userId = auth.user.id;

      const task = await Task.findOrFail(params.id);
      await task.load('users');
      const taskJSON = task.toJSON();

      const isUserInTask =
        taskJSON.users.findIndex(user => user.id === userId) ||
        taskJSON.owner_id === userId;

      if (isUserInTask === true || isUserInTask >= 0) {
        for (const user of taskJSON.users) {
          delete user.password;
          delete user.pivot;
          delete user.created_at;
          delete user.updated_at;
        }

        return response.status(200).json(taskJSON);
      }

      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error: 'Tarefa não encontrada!',
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }
}

module.exports = TaskController;
