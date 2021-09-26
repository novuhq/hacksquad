import * as Bull from 'bull';
import { Queue } from 'bull';
import { IUserProcessQueue } from './queue.interface';

export const USER_PROCESS_QUEUE = 'user_process_queue';

export class QueueService {
  private bullConfig: Bull.QueueOptions = {
    settings: {
      lockDuration: 90000,
    },
    redis: {
      db: Number(process.env.REDIS_DB_INDEX),
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      connectTimeout: 50000,
      keepAlive: 30000,
      family: 4,
    },
  };

  public userProcessQueue: Queue<IUserProcessQueue> = new Bull(USER_PROCESS_QUEUE, this.bullConfig) as Queue;

  async getJobStats(type: 'user_process_queue'): Promise<{ waiting: number; active: number }> {
    if (type === 'user_process_queue') {
      return {
        waiting: await this.userProcessQueue.getWaitingCount(),
        active: await this.userProcessQueue.getActiveCount(),
      };
    }
    throw new Error(`Unexpected type ${type}`);
  }

  async cleanAllQueues() {
    await this.userProcessQueue.empty();
  }
}
