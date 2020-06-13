/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TaskUsersSchema extends Schema {
  up() {
    this.create('task_users', (table) => {
      table.increments();

      table.integer('task_id').notNullable().unsigned();
      table.integer('user_id').notNullable().unsigned();
    });
  }

  down() {
    this.drop('task_users');
  }
}

module.exports = TaskUsersSchema;
