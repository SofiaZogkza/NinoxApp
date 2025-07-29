import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue.service'; // Fixed relative path

@Injectable()
export class CoordinatorService {
  constructor(private readonly queueService: QueueService) {}

  async startWorkflow(invoicePayload: { orderId: string; customerEmail: string }) {
    // 1. Generate invoice
    await this.queueService.enqueueTask('invoice', {
      type: 'invoice',
      orderId: invoicePayload.orderId,
    });

    // 2. Generate PDF (simulated with fixed ID)
    await this.queueService.enqueueTask('pdf', {
      type: 'pdf',
      invoiceId: 123, // In real app, use the ID from step 1
    });

    // 3. Send email
    await this.queueService.enqueueTask('email', {
      type: 'email',
      email: invoicePayload.customerEmail,
    });
  }
}