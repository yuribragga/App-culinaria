import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.mealPlans)
  user!: User;

  @Column('simple-json')
  week!: {
    [day: string]: {
      breakfast?: { recipeId: number, time: string | null };
      lunch?: { recipeId: number, time: string | null };
      snack?: { recipeId: number, time: string | null };
      dinner?: { recipeId: number, time: string | null };
    };
  };
}