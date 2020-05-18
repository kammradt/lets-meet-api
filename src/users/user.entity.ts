import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: UserRole;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  async hasCorrectPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
