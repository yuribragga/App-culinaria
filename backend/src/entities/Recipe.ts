import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  ingredients!: string;

  @Column()
  instructions!: string;

  @Column()
  time!: number;

  @Column()
  servings!: number;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => User, (user) => user.recipes, { nullable: false })
  user!: User;
}
