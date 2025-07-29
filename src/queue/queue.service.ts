import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('invoice') private invoiceQueue: Queue,
    @InjectQueue('pdf') private pdfQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async enqueueTask(queueName: 'invoice' | 'pdf' | 'email', data: any) {
    const queue = this.getQueue(queueName);
    return queue.add(queueName, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }

  private getQueue(queueName: string): Queue {
    switch (queueName) {
      case 'invoice': return this.invoiceQueue;
      case 'pdf': return this.pdfQueue;
      case 'email': return this.emailQueue;
      default: throw new Error(`Unknown queue: ${queueName}`);
    }
  }
}