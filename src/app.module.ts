import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './queue/queue.module';
import { InvoiceController } from './workflows/invoice/invoice.controller';
import { InvoiceWorker } from './queue/worker/invoice.worker';
import { InvoiceWorkflow } from './workflows/invoice/invoice.workflow';
import { TaskEntity } from './tasks/tasks.entity';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true, // Make config available across all modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        entities: [TaskEntity],
        synchronize: true, // TODO: Remove in PROD
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TaskEntity]), // Make TaskEntity available for injection
    QueueModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceWorkflow, InvoiceWorker],
})
export class AppModule {}