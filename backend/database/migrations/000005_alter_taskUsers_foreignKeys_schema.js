/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TaskUsersSchema extends Schema {
  up() {
    this.table('task_users', table => {
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .foreign('task_id')
        .references('id')
        .inTable('tasks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
  }

  down() {
    this.table('task_users', table => {
      table.dropForeign('user_id');
      table.dropForeign('task_id');
    });
  }
}

module.exports = TaskUsersSchema;
