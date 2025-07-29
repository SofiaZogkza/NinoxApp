import { Logger } from '@nestjs/common';
import { Processor } from '@nestjs/bull';

@Processor('default')
export abstract class BaseWorker {
  protected readonly logger = new Logger(this.constructor.name);
  
  private getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  protected handleError(job: unknown, error: unknown) {
    const errorMessage = this.getErrorMessage(error);
    this.logger.error(`Job failed: ${errorMessage}`);
    throw error;
  }
}