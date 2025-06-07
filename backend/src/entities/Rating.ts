import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Recipe } from './Recipe';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', width: 1 })
  stars!: number; // 1 a 5

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @ManyToOne(() => User, user => user.id)
  user!: User;

  @ManyToOne(() => Recipe, recipe => recipe.id)
  recipe!: Recipe;

  @CreateDateColumn()
  createdAt!: Date;
}