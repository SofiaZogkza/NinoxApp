import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CoordinatorService {
  constructor(private readonly queueService: QueueService) {}

  async startWorkflow(invoicePayload: Record<string, any>) {
    await this.queueService.enqueueTask('generateInvoice', invoicePayload);
    await this.queueService.enqueueTask('generatePDF', { invoiceId: 123 });
    await this.queueService.enqueueTask('sendEmail', { email: 'customer@example.com' });
  }
}