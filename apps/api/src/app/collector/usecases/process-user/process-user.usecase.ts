import { Injectable, Scope } from '@nestjs/common';
import { UserEntity } from '@hacksquad/core';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ['mercy-preview'],
});

@Injectable()
export class ProcessUserUsecase {
  async execute(command: { user: UserEntity }) {
    const issues = await this.getPullRequests(command.user.username);

    for (const issue of issues) {
      const { pr, topics } = await this.getMetadata(issue.repository_url, issue.pull_request.url);
      const labels = pr.labels
        .filter((i) => i)
        .map((i) => {
          return String(i.name).toLowerCase();
        });
      const isSpam = labels.includes('invalid') || labels.includes('spam');
      const hacktoberAccepted = labels.includes('hacktoberfest-accepted');
      const hacktoberfestRepo = topics.names.includes('hacktoberfest') || topics.names.includes('hacktoberfest2021');

      const data = {
        id: pr.id,
        url: pr.url,
        title: pr.title,
        created: pr.created_at,
        updated_at: pr.updated_at,
        additions: pr.additions,
        deletions: pr.deletions,
        files: pr.changed_files,
        isSpam,
        accepted: hacktoberAccepted,
        hacktoberRepo: hacktoberfestRepo,
        merged: pr.merged,
        state: pr.state,
        status: 'ignored',
        raw: {
          pr,
          issue,
        },
      };
      data.status = this.getPrStatus(data);
    }
  }

  private async getMetadata(repositoryUrl: string, prUrl: string) {
    const { data: topics } = await octokit.request(`GET ${repositoryUrl}/topics`, {
      per_page: 100,
    });
    const { data: pr } = await octokit.request(`GET ${prUrl}`);

    return {
      topics,
      pr,
    };
  }

  private async getPullRequests(username: string) {
    const pullRequests = [];
    for await (const response of octokit.paginate.iterator(octokit.search.issuesAndPullRequests, {
      q: `author:${username} created:>2021-09-01 type:pr`,
      per_page: 100,
    })) {
      pullRequests.push(...response.data);
    }

    return pullRequests;
  }

  private getPrStatus(data): string {
    if (data.isSpam) {
      return 'invalid';
    }

    if (data.accepted) {
      if (data.merged) {
        return 'merged';
      }
      return 'accepted';
    }

    if (data.hacktoberRepo) {
      if (data.merged) {
        return 'merged';
      }

      if (data.state === 'closed') {
        return 'invalid';
      }
    }

    return 'ignored';
  }
}
