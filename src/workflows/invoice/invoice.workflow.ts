import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class InvoiceWorkflow {
  constructor(
    @InjectQueue('invoice') private readonly invoiceQueue: Queue,
  ) {}

  async startInvoiceProcess(orderId: string) {
    await this.invoiceQueue.add('generate_invoice', { orderId }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
    return { queued: true, orderId };
  }
}