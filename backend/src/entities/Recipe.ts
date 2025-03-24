import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('simple-array')
  ingredients!: string;

  @Column()
  instructions!: string;

  @Column()
  time!: number;

  @Column()
  servings!: number;

  @Column({ type: 'blob', nullable: true })
  image!: Buffer | null;

  @ManyToOne(() => User, (user) => user.recipes, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
