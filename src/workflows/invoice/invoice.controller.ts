import { Controller, Post, Body } from '@nestjs/common';
import { InvoiceWorkflow } from './invoice.workflow';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceWorkflow: InvoiceWorkflow) {}

  @Post()
  async createInvoice(@Body() body: { orderId: string }) {
    return this.invoiceWorkflow.startInvoiceProcess(body.orderId);
  }
}