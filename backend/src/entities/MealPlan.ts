import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

// Exemplo de entidade (TypeORM)
@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  // Se quiser relação direta:
  @ManyToOne(() => User, user => user.mealPlans)
  user!: User;

  @Column('simple-json')
  week!: {
    [day: string]: {
      breakfast?: number; 
      lunch?: number;
      snack?: number;
      dinner?: number;
    };
  };
}