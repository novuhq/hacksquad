import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ContributionEntity } from './contribution.entity';

const contributionSchema = new Schema(
  {
    issueId: Schema.Types.String,
    url: Schema.Types.String,
    title: Schema.Types.String,
    created: Schema.Types.Date,
    updated_at: Schema.Types.Date,
    additions: Schema.Types.Number,
    deletions: Schema.Types.Number,
    files: Schema.Types.Number,
    isSpam: Schema.Types.Boolean,
    accepted: Schema.Types.Boolean,
    hacktoberRepo: Schema.Types.Boolean,
    merged: Schema.Types.Boolean,
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    state: Schema.Types.String,
    status: Schema.Types.String,
    raw: {
      pr: Schema.Types.Mixed,
      issue: Schema.Types.Mixed,
    },
  },
  schemaOptions
);

export interface IContributionDocument extends ContributionEntity, Document {
  _id: string;
}

contributionSchema.index({ _organizationId: 1, status: 1 });

export const Contribution =
  mongoose.models.Contribution || mongoose.model<IContributionDocument>('Contribution', contributionSchema);
