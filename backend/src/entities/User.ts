import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Recipe } from './Recipe';
import { Comment } from './comments'; // Import da entidade Comment
import { MealPlan } from './MealPlan';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  socialName?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nationality!: string;

  @Column()
  phoneNumber!: string;

  @OneToMany(() => Recipe, (recipe) => recipe.user, { cascade: true, onDelete: 'CASCADE' })
  recipes!: Recipe[];

  @Column({ type: 'text', nullable: true })
  profileImage!: Buffer | null;

  @ManyToMany(() => Recipe)
  @JoinTable()
  favorites!: Recipe[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments!: Comment[];

  @OneToMany(() => MealPlan, mealPlan => mealPlan.user)
    mealPlans!: MealPlan[];
}
