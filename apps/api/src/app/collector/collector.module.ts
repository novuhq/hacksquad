import { Module, OnModuleInit } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ProcessUserUsecase } from './usecases/process-user/process-user.usecase';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [ProcessUserUsecase],
  exports: [ProcessUserUsecase],
})
export class CollectorModule {}
