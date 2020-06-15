/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Task extends Model {
  static boot() {
    super.boot();
  }

  users() {
    return this.belongsToMany('App/Models/User').pivotTable('task_users');
  }
}

module.exports = Task;
