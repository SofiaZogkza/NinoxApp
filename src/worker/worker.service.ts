import { Worker, QueueEvents } from 'bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    const worker = new Worker('tasks', async job => {
      const taskRepo = this.dataSource.getRepository(TaskEntity);
      const task = taskRepo.create({
        type: job.name,
        payload: job.data,
        status: 'processing',
      });
      await taskRepo.save(task);

      try {
        // Simulate task processing
        if (job.name === 'sendEmail') {
          console.log(`Sending email to ${job.data.email}`);
        }
        task.status = 'completed';
      } catch (err) {
        task.status = 'failed';
        task.errorMessage = err.message;
        throw err;
      } finally {
        await taskRepo.save(task);
      }
    });
  }
}