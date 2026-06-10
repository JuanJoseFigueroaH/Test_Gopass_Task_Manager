import { User } from '../models/user.model';

export interface UserReadRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export interface UserWriteRepositoryPort {
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}

export interface UserRepositoryPort extends UserReadRepositoryPort, UserWriteRepositoryPort {}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
