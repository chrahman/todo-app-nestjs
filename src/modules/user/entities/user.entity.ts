import { Todo } from '../../todos/entities/todo.entity';
import { BaseModel } from '../../../common/entities/baseModal.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseModel {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column()
  isSuperAdmin: boolean;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
