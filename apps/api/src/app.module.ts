import { Module, OnModuleInit } from '@nestjs/common';
import { CronService, QueueService, UserRepository } from '@hacksquad/core';
import { GraphQLModule } from '@nestjs/graphql';
import { SharedModule } from './app/shared/shared.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TestingModule } from './app/testing/testing.module';
import { HealthModule } from './app/health/health.module';
import { OrganizationModule } from './app/organization/organization.module';
import { CollectorModule } from './app/collector/collector.module';
import { ProcessUserUsecase } from './app/collector/usecases/process-user/process-user.usecase';
import { StorageModule } from './app/storage/storage.module';
import { LeaderboardModule } from './app/leaderboard/leaderboard.module';

@Module({
  imports: [
    OrganizationModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      context: ({ req }) => ({ req }),
    }),
    SharedModule,
    TestingModule,
    SharedModule,
    UserModule,
    AuthModule,
    HealthModule,
    CollectorModule,
    StorageModule,
    LeaderboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: CronService,
      useFactory: () => {
        return new CronService({
          mongoUrl: process.env.MONGO_URL,
        });
      },
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private queueService: QueueService,
    private cronService: CronService,
    private processUser: ProcessUserUsecase,
    private userRepository: UserRepository
  ) {}

  async onModuleInit() {
    await this.cronService.initialize();

    this.cronService.define('collector_job', async (job, done) => {
      const users = await this.userRepository.find({});

      for (const user of users) {
        // eslint-disable-next-line no-console
        console.log('Processing user: ', user.username);
        await this.queueService.userProcessQueue.add(
          {
            userId: user._id,
          },
          {
            removeOnComplete: true,
          }
        );
      }

      done();
    });

    await this.cronService.processEvery('collector_job', '30 minutes');
    await this.cronService.processNow('collector_job');

    this.queueService.userProcessQueue.process(5, async (job) => {
      const user = await this.userRepository.findById(job.data.userId);

      await this.processUser.execute({
        user,
      });
    });
  }
}
