import { Module } from '@nestjs/common';
import {
  DalService,
  QueueService,
  UserRepository,
  StorageService,
  AnalyticsService,
  MailService,
  OrganizationRepository,
  ContributionRepository,
} from '@hacksquad/core';
import { AcceptInviteUsecase } from './usecases/accept-invite/accept-invite.usecase';

const DAL_MODELS = [UserRepository, OrganizationRepository, ContributionRepository];

const dalService = new DalService();
export const ANALYTICS_SERVICE = 'AnalyticsService';

const PROVIDERS = [
  {
    provide: QueueService,
    useFactory: () => {
      return new QueueService();
    },
  },
  {
    provide: DalService,
    useFactory: async () => {
      await dalService.connect(process.env.MONGO_URL);
      return dalService;
    },
  },
  ...DAL_MODELS,
  StorageService,
  {
    provide: ANALYTICS_SERVICE,
    useFactory: async () => {
      const analyticsService = new AnalyticsService();
      await analyticsService.initialize();

      return analyticsService;
    },
  },
  MailService,
];
@Module({
  imports: [],
  providers: [...PROVIDERS, AcceptInviteUsecase],
  exports: [...PROVIDERS, AcceptInviteUsecase],
})
export class SharedModule {}
