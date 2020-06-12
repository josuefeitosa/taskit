import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  BaseModel,
  column,
  beforeSave,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';

import Task from 'App/Models/Task';

export default class User extends BaseModel {
  @manyToMany(() => Task, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'task_id',
    pivotTable: 'user_tasks',
  })
  public tasks: ManyToMany<typeof Task>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.hash(user.password);
    }
  }

  @column.dateTime({ autoCreate: true, serializeAs: 'creation_date' })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
