import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
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

  @OneToMany(() => Recipe, (recipe) => recipe.user, { cascade: true, onDelete: 'CASCADE' })
  recipes!: Recipe[];

  @Column({ type: 'text', nullable: true })
  profileImage!: Buffer | null;

  @ManyToMany(() => Recipe)
  @JoinTable()
  favorites!: Recipe[];
}
