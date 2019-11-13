import { getNotificationsMatchesCandidate, getNotificationsContractsCandidate } from "./../../managers/notificationsManager";
import { Matchbox } from './../../../matching/models/MatchboxModel';

interface IMatchesNotificationsCandidate {
  candidateId?: string;
  missionId?: string;
  seenByCandidate?: boolean;
}

interface IContractsNotificationsCandidate {
  candidateId?: string;
  missionId?: string;
  seenByCandidate?: boolean;
  contractStatus?: string;
  matchStatus?: string;
}

async function buildNotificationsMatchesForCandidate(userId: string) {
  const matchboxes: Matchbox[] = await getNotificationsMatchesCandidate(userId);
  const matches: IMatchesNotificationsCandidate[] = [];

  for (const matchbox of matchboxes) {
    for (const match of matchbox.matches!) {
      matches.push({ candidateId: match.candidateId, seenByCandidate: match.seenByCandidate, missionId: matchbox.missionId })
    }
  }
  return matches;
}

async function buildNotificationsContractsForCandidate(userId: string) {
  const matchboxes: Matchbox[] = await getNotificationsContractsCandidate(userId);
  const contracts: IContractsNotificationsCandidate[] = [];

  for (const matchbox of matchboxes) {
    for (const match of matchbox.matches!) {
      for (const contract of match.contracts!) {
        contracts.push({ candidateId: contract.toUserId, matchStatus: match.matchStatus, contractStatus: contract.contractStatus, missionId: matchbox.missionId, seenByCandidate: contract.seenByCandidate })
      }
    }
  }
  return contracts;
}

export default async function buildNotificationsForCandidate(userId: string): Promise<any> {
  const notifications: any = {};
  try {
    notifications.matches = await buildNotificationsMatchesForCandidate(userId);
    notifications.contracts = await buildNotificationsContractsForCandidate(userId);
    return notifications;

  } catch (error) {
    throw error;
  }
}
