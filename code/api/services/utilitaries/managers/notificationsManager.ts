import MatchboxModel from "./../../matching/models/MatchboxModel";

export async function getNotificationsMatchesCandidate(userId: string) {
  try {
    const matchboxes = await MatchboxModel.find({ 'matches.candidateId': userId, matchboxStatus: 'pending' });
    return matchboxes;

  } catch (error) {
    throw error;
  }
}

export async function getNotificationsMatchesRecruiter(userId: string) {
  try {
    const matchboxes = await MatchboxModel.find({ recruiterId: userId, matchboxStatus: 'pending' });
    return matchboxes;

  } catch (error) {
    throw error;
  }
}

export async function getNotificationsContractsCandidate(userId: string) {
  try {
    // find into matches > match > contracts > contrac === 'refused' || 'accetped'
    const matchboxes = await MatchboxModel.find( { 'matches.candidateId': userId, $or: [{'matches.contracts.contractStatus': 'offered'}, {'matches.matchStatus': 'withdrawed'}]});
    return matchboxes;

  } catch (error) {
    throw error;
  }
}

export async function getNotificationsContractsRecruiter(userId: string) {
  try {
    // find into matches > match > contracts > contrac === 'refused' || 'accetped'
    const matchboxes = await MatchboxModel.find( { recruiterId: userId, 'matches': { $elemMatch: { contracts: { $elemMatch: {$or: [{contractStatus: 'refused'}, {contractStatus: 'accepted'}]}}}}});
    return matchboxes;

  } catch (error) {
    throw error;
  }
}

export async function updateSeenMatchByCandidate(userId: string) {
  // @EZRA
  try {
    const test = await MatchboxModel.updateMany(
      {'matches.candidateId': userId, 'matches.seenByCandidate': false},
      {'$set': { 'matches.$[match].seenByCandidate': true }},
      { multi: true, arrayFilters: [{'match.seenByCandidate': false}] }
    )
  } catch (error) {
    throw error;
  }
}

export async function updateSeenMatchByRecruiter(userId: string) {
  try {
    await MatchboxModel.updateMany(
      {recruiterId: userId},
      {'$set': {'matches.$[match].seenByRecruiter': true}},
      {multi: true, arrayFilters: [{"match.seenByRecruiter": false}]}
    )
  } catch (error) {
    throw error;
  }
}

export async function updateSeenContractOfferedByCandidate(userId: string) {
  try {
    const test = await MatchboxModel.updateMany(
      {'matches.candidateId': userId},
      {'$set': {'matches.$[match].contracts.$[contract].seenByCandidate' : true}},
      {multi: true, arrayFilters: [{"match.seenByCandidate": true || false}, {"contract.seenByCandidate": false} && {"contract.contractStatus": "offered"}]}
    )

  } catch (error) {
    throw error;
  }
}

export async function updateSeenContractAcceptedByRecruiter(userId: string) {
  // @EZRA
  try {
    await MatchboxModel.updateMany(
      {recruiterId: userId},
      {'$set': {'matches.$[match].contracts.$[contract].seenByRecruiter' : true}},
      {multi: true, arrayFilters: [{"match.seenByRecruiter": true || false}, {"contract.seenByRecruiter": false} && {"contract.contractStatus": "accepted"}]}
    )
  } catch (error) {
    throw error;
  }
}

export async function updateSeenContractRefusedByRecruiter(userId: string) {
  try {
    await MatchboxModel.updateMany(
      {recruiterId: userId},
      {'$set': {'matches.$[match].contracts.$[contract].seenByRecruiter' : true}},
      {multi: true, arrayFilters: [{"match.seenByRecruiter": true || false}, {"contract.seenByRecruiter": false} && {"contract.contractStatus": "refused"}]}
    )
  } catch (error) {
    throw error;
  }
}
