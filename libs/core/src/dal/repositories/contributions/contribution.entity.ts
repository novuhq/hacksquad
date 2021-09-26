export class ContributionEntity {
  _id?: string;

  issueId: string;
  url: string;
  title: string;
  created: string;
  updatedAt: string;
  additions: number;
  deletions: number;
  files: number;
  isSpam: boolean;
  accepted: boolean;
  hacktoberRepo: boolean;
  merged: boolean;
  state: string;
  _organizationId: string;
  _userId: string;
  status: string;
  raw: {
    pr: any;
    issue: any;
  };
}
