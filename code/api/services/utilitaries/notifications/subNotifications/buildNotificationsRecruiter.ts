import { getNotificationsMatchesRecruiter, getNotificationsContractsRecruiter } from "./../../managers/notificationsManager";
import { Matchbox } from './../../../matching/models/MatchboxModel';

interface IMatchesNotificationsRecruiter {
  candidateId?: string;
  missionId?: string;
  seenByRecruiter?: boolean;
}

interface IContractsNotificationsRecruiter {
  candidateId?: string;
  missionId?: string;
  seenByRecruiter?: boolean;
  contractStatus?: string;
}

async function buildNotificationsMatchesForRecruiter(userId: string) {
  const matchboxes: Matchbox[] = await getNotificationsMatchesRecruiter(userId);
  const matches: IMatchesNotificationsRecruiter[] = [];

  for (const matchbox of matchboxes) {
    for (const match of matchbox.matches!) {
      matches.push({ candidateId: match.candidateId, seenByRecruiter: match.seenByRecruiter, missionId: matchbox.missionId })
    }
  }
  return matches;
}

async function buildNotificationsContractsForRecruiter(userId: string) {
  const matchboxes: Matchbox[] = await getNotificationsContractsRecruiter(userId);
  const contracts: IContractsNotificationsRecruiter[] = [];

  for (const matchbox of matchboxes) {
    for (const match of matchbox.matches!) {
      for (const contract of match.contracts!) {
        contracts.push({ candidateId: contract.toUserId, contractStatus: contract.contractStatus, missionId: matchbox.missionId, seenByRecruiter: contract.seenByRecruiter })
      }
    }
  }

  return contracts;

}

export default async function buildNotificationsForRecruiter(userId: string): Promise<any> {
  const notifications: any = {};
  try {
    notifications.matches = await buildNotificationsMatchesForRecruiter(userId);
    notifications.contracts = await buildNotificationsContractsForRecruiter(userId);
    return notifications;

  } catch (error) {
    throw error;
  }
}
