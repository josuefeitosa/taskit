const User = use('App/Models/User');
const Task = use('App/Models/Task');
const Mail = use('Mail');
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
    const trx = await Database.beginTransaction();
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

      const createdTask = await Task.create(taskData, trx);
      const createdTaskJSON = createdTask.toJSON();

      await trx.from('task_users').insert({
        task_id: createdTaskJSON.id,
        user_id: ownerId,
      });

      for (const teamMate of teamMatesUsers) {
        await trx.from('task_users').insert({
          task_id: createdTaskJSON.id,
          user_id: teamMate.id,
        });

        const dataForEmail = {
          name: teamMate.name,
          email: teamMate.email,
          owner: auth.user.name,
          task: createdTaskJSON.title,
          status: createdTaskJSON.status,
          taskTerm: moment(createdTaskJSON).format('DD/MM/YYYY'),
        };

        await Mail.send('emails.newTask', dataForEmail, message => {
          message
            .to(teamMate.email)
            .from('noreplay.taskit@gmail.com')
            .subject('TaskIt - Nova tarefa para você!');
        });
      }

      await trx.commit();
      return response.status(201).json({
        message: 'Tarefa criada com sucesso!',
        task: createdTaskJSON,
        teamMates,
      });
    } catch (error) {
      await trx.rollback();
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
