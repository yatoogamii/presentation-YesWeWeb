

import { prop, arrayProp, Typegoose } from 'typegoose';

enum MatchboxStatus {
  PENDING = 'pending',
  FOUND = 'found',
  FAILED = 'failed',
}

enum MatchStatus {
  PENDING = 'pending',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  WITHDRAWED = 'withdrawed',
}

enum ContractStatus {
  REFUSED = 'refused',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
}

enum ContractTypes {
  'CDD' = 'cdd',
  'CDI' = 'cdi',
  'INTERIM' = 'interim',
}

enum ShareStatus {
  PENDING = 'pending',
  DONE = 'done',
}

class ContractsWithUser extends Typegoose {

  @prop({ index: true, })
  public fromUserId?: string;

  @prop({ index: true, })
  public toUserId?: string;

  @prop({ default: false })
  public seenByRecruiter?: boolean;

  @prop({ default: false })
  public seenByCandidate?: boolean;

  @prop({})
  public dateOfAnswer?: Date;

  @prop({ default: Date.now(), })
  public dateOfCreation?: Date;

  @prop({ enum: ContractStatus, default: 'offered' })
  public contractStatus?: string;

  @prop({})
  public contract?: string;

  @prop({})
  public positionWanted?: string;

  @prop({})
  public from?: Date;

  @prop({})
  public to?: Date;

  @prop({})
  public annualSalary?: number;

  @prop({})
  public variable?: number;

  @prop({})
  public reasonCandidateRefused?: string;

  @prop({})
  public privateReasonCandidateRefused?: string;

}

class Matches extends Typegoose {

  @prop({ default: Date.now(), })
  public dateOfMatching?: Date;

  @prop({ default: false })
  public seenByRecruiter?: boolean;

  @prop({ default: false })
  public seenByCandidate?: boolean;

  @prop({ index: true, })
  public candidateId?: string;

  @prop({ enum: MatchStatus, default: 'pending' })
  matchStatus?: string;

  @prop({})
  reasonRecruiterWithdrawed?: string;

  @prop({})
  privateReasonRecruiterWithdrawed?: string;

  @arrayProp({ items: ContractsWithUser, default: [], })
  public contracts?: ContractsWithUser[];
}

class Like extends Typegoose {

  @prop({ required: true, index: true, })
  public userId!: string;

  @prop({ default: Date.now(), })
  public date!: string;

  @prop({ required: false, })
  public by?: string;

}

export interface IMatchbox extends Partial<Matchbox> {
  _id?: string;
}

export class Matchbox extends Typegoose {

  @prop({ index: true, })
  public missionId?: string;

  @prop({})
  public businessId?: string;

  @prop({})
  public recruiterId?: string;

  @prop({ enum: MatchboxStatus, default: 'pending' })
  matchboxStatus?: string;

  @arrayProp({ items: Like, default: [], })
  public likedBy?: Like[];

  @arrayProp({ items: Like, default: [], })
  public liked?: Like[];

  // @arrayProp({ items: Shared, default: [], })
  // public shared?: Shared[];

  @arrayProp({ items: Matches, default: [], })
  public matches?: Matches[];

}

export default new Matchbox().getModelForClass(Matchbox, {
  schemaOptions: { collection: 'matchboxes' }
});

