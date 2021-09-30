import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { OrganizationEntity } from './organization.entity';

const memberSchema = new Schema(
  {
    invite: {
      email: Schema.Types.String,
      token: {
        type: Schema.Types.String,
        index: true,
      },
      invitationDate: Schema.Types.Date,
      answerDate: Schema.Types.Date,
      _inviterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    memberStatus: Schema.Types.String,
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    roles: [Schema.Types.String],
  },
  schemaOptions
);

memberSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const organizationSchema = new Schema(
  {
    company: Schema.Types.String,
    name: Schema.Types.String,
    tagline: Schema.Types.String,
    logo: Schema.Types.String,
    color: Schema.Types.String,
    members: [memberSchema],
  },
  schemaOptions
);

interface IOrganizationDocument extends OrganizationEntity, Document {
  _id: never;
}

export const Organization =
  mongoose.models.Organization || mongoose.model<IOrganizationDocument>('Organization', organizationSchema);
