import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserTasks extends BaseSchema {
  protected tableName = 'user_tasks';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');

      table.integer('user_id');
      table.integer('task_id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
