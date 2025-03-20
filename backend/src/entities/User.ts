import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';

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

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes!: Recipe[];
}
