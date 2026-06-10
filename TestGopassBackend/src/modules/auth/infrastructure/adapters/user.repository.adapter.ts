import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/models/user.model';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserOrmEntity } from '../persistence/user.orm-entity';
import { UserMapper } from '../persistence/user.mapper';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email: email.toLowerCase() } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map(UserMapper.toDomain);
  }

  async create(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    const entity = this.repository.create(persistence);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    await this.repository.update(user.id!, persistence);
    return (await this.findById(user.id!))!;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
