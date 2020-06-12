import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');

      table.string('title').notNullable();
      table.date('term').notNullable();
      table.string('status').notNullable();

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
