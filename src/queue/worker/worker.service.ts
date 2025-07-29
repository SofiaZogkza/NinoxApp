import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../../tasks/tasks.entity';
import { getErrorMessage } from '../../common/utils/error.utils';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async handleTask(job: Job) {
    try {
      const task = await this.tasksRepository.findOne({ where: { id: job.id } });
      
      if (!task) throw new Error('Task not found');
      
      // TASK Logic here: ..........
      
      task.status = 'completed';
      await this.tasksRepository.save(task);
      
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      await this.tasksRepository.update(
        { id: job.id },
        { 
          status: 'failed',
          errorMessage 
        }
      );
      throw err; // Important for BullMQ retries !!!!
    }
  }
}