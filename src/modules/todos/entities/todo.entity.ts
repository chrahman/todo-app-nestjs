import { User } from '../../user/entities/user.entity';
import { BaseModel } from '../../../common/entities/baseModal.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Todo extends BaseModel {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  isCompleted: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.todos, { eager: true })
  user: User;
}
