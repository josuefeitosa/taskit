/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TaskSchema extends Schema {
  up() {
    this.create('tasks', (table) => {
      table.increments();

      table.string('title', 80).notNullable();
      table.date('term').notNullable();
      table.string('status', 80).notNullable();
      table.integer('owner_id').unsigned().notNullable();

      table.timestamps();
    });
  }

  down() {
    this.drop('tasks');
  }
}

module.exports = TaskSchema;
