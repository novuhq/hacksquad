import { Module, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '@hacksquad/core';
import { SharedModule } from '../shared/shared.module';
import { ProcessUserUsecase } from './usecases/process-user/process-user.usecase';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [ProcessUserUsecase],
  exports: [ProcessUserUsecase],
})
export class CollectorModule implements OnModuleInit {
  constructor(private processUser: ProcessUserUsecase, private userRepository: UserRepository) {}

  async onModuleInit() {
    const users = await this.userRepository.find({});

    for (const user of users) {
      await this.processUser.execute({
        user,
      });
    }
  }
}
