// const Task = use('App/Models/Task');
const User = use('App/Models/User');
const Mail = use('Mail');
const moment = use('moment');

class TaskOtherController {
  async currentTasks({ response }) {
    const users = await User.query().with('tasks').fetch();
    const usersJSON = users.toJSON();

    const tasksArr = [];
    for (const user of usersJSON) {
      const currentTasks = user.tasks.filter(
        task => task.status === 'Stand by' || task.status === 'Em andamento',
      );

      tasksArr.push({
        user: user.name,
        email: user.email,
        tasks: currentTasks.map(task => {
          return {
            title: task.title,
            term: moment(task.term).format('DD/MM/YYYY'),
            status: task.status,
          };
        }),
      });
    }

    for (const user of tasksArr) {
      const dataForEmail = {
        name: user.name,
        email: user.email,
        tasks: user.tasks.map(task => {
          return {
            title: task.title,
            status: task.status,
            term: moment(task.term).format('DD/MM/YYYY').toString(),
          };
        }),
      };

      await Mail.send('emails.currentTasks', dataForEmail, message => {
        message
          .to(user.email)
          .from('noreplay.taskit@gmail.com')
          .subject('TaskIt - Tarefas pendentes!');
      });
    }

    return response.json(tasksArr);
  }
}

module.exports = TaskOtherController;
