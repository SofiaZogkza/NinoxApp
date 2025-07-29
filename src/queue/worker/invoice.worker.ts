import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../tasks/tasks.entity';
import { getErrorMessage } from '../../common/utils/error.utils';

@Processor('invoice')
export class InvoiceWorker {
  private readonly logger = new Logger(InvoiceWorker.name);

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  @Process('generate_invoice')
  async handleInvoiceGeneration(job: Job<{ taskId: string; orderId: string }>) {
    try {
      // 1. Fetch and validate task
      const task = await this.taskRepository.findOne({ 
        where: { id: job.data.taskId } 
      });
      if (!task) {
        throw new Error(`Task ${job.data.taskId} not found`);
      }

      // 2. Update task status
      task.status = 'processing';
      await this.taskRepository.save(task);

      this.logger.log(`Processing invoice for order ${job.data.orderId}`);
      
      // 3. Simulate work (replace with real invoice generation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 4. Mark as completed
      task.status = 'completed';
      await this.taskRepository.save(task);
      
      this.logger.log('Invoice generated successfully');
      return { success: true };

    } catch (err: unknown) {
      this.logger.error(`Invoice generation failed: ${getErrorMessage(err)}`);
      
      // 5. Update failed task if possible
      if (job.data.taskId) {
        await this.taskRepository.update(
          { id: job.data.taskId },
          { 
            status: 'failed',
            errorMessage: getErrorMessage(err) 
          }
        );
      }

      throw err; // Important for BullMQ retries
    }
  }
}