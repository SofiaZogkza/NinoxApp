import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  type!: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: 'jsonb', nullable: true })
  payload?: any;
}