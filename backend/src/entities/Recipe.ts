import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Ingredient } from './Ingredient';
import { Comment } from './comments'; // Import da entidade Comment

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: true })
  ingredients!: Ingredient[];

  @Column('simple-array')
  instructions!: string[];

  @Column()
  time!: number;

  @Column()
  servings!: number;

  @Column({ type: 'blob', nullable: true })
  imageData?: Buffer;

  @Column({ nullable: true })
  imageMimeType?: string;

  @Column()
  classification!: string;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.recipe, { cascade: true })
  comments!: Comment[];
}
