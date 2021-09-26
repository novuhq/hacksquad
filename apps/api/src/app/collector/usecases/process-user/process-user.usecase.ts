import { Injectable, Scope } from '@nestjs/common';
import { UserEntity, ContributionEntity, ContributionRepository, OrganizationRepository } from '@hacksquad/core';
import { Octokit } from '@octokit/rest';

@Injectable()
export class ProcessUserUsecase {
  constructor(
    private contributionRepository: ContributionRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(command: { user: UserEntity }) {
    const octokit = new Octokit({
      auth: command.user.tokens[0].accessToken,
      previews: ['mercy-preview'],
    });

    const issues = await this.getPullRequests(command.user.username, octokit);
    const userOrganizations = await this.organizationRepository.findUserActiveOrganizations(command.user._id);
    if (!userOrganizations?.length) return;

    for (const issue of issues) {
      const { pr, topics } = await this.getMetadata(issue.repository_url, issue.pull_request.url, octokit);
      const labels = pr.labels
        .filter((i) => i)
        .map((i) => {
          return String(i.name).toLowerCase();
        });
      const isSpam = labels.includes('invalid') || labels.includes('spam');
      const hacktoberAccepted = labels.includes('hacktoberfest-accepted');
      const hacktoberfestRepo = topics.names.includes('hacktoberfest') || topics.names.includes('hacktoberfest2021');

      const data: ContributionEntity = {
        issueId: issue.id,
        url: pr.url,
        title: pr.title,
        created: pr.created_at,
        updatedAt: pr.updated_at,
        additions: pr.additions,
        deletions: pr.deletions,
        files: pr.changed_files,
        isSpam,
        accepted: hacktoberAccepted,
        hacktoberRepo: hacktoberfestRepo,
        merged: pr.merged,
        state: pr.state,
        status: 'ignored',
        _organizationId: userOrganizations[0]?._id,
        _userId: command.user._id,
        raw: {
          pr,
          issue,
        },
      };

      data.status = this.getPrStatus(data);

      const foundIssue = await this.contributionRepository.findOne({
        issueId: issue.id,
        _userId: command.user._id,
      });

      if (!foundIssue) {
        await this.contributionRepository.create(data);
      } else if (data.status !== foundIssue.status) {
        await this.contributionRepository.update({ _id: foundIssue._id }, { $set: { ...data } });
      }
    }
  }

  private async getMetadata(repositoryUrl: string, prUrl: string, octokit: Octokit) {
    const { data: topics } = await octokit.request(`GET ${repositoryUrl}/topics`, {
      per_page: 100,
    });
    const { data: pr } = await octokit.request(`GET ${prUrl}`);

    return {
      topics,
      pr,
    };
  }

  private async getPullRequests(username: string, octokit: Octokit) {
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
