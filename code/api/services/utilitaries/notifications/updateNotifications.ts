import { Request, Response, NextFunction } from "express";
import { updateSeenMatchByRecruiter, updateSeenMatchByCandidate, updateSeenContractOfferedByCandidate, updateSeenContractAcceptedByRecruiter, updateSeenContractRefusedByRecruiter } from './../managers/notificationsManager';
import {TByWho} from "../../interfaces/TypesEntities";
import {IAnswer} from "../../interfaces/InterfaceAnswer";

function updateNotificationsCandidate(category: string, userId: string) {
  switch (category) {
    case 'match':
      return updateSeenMatchByCandidate(userId);

    case 'contractOffered': 
      return updateSeenContractOfferedByCandidate(userId);

    default:
      throw new Error('category is undefined')
  }
}

function updateNotificationsRecruiter(category: string, userId: string) {
  switch (category) {
    case 'match':
      return updateSeenMatchByRecruiter(userId);
      break;
    case 'contractAccepted':
      return updateSeenContractAcceptedByRecruiter(userId);
      break;
    case 'contractRefused':
      return updateSeenContractRefusedByRecruiter(userId);
      break;

    default:
      throw new Error('category is undefined')
  }
}

export default (byWho: TByWho, category: string) => async ( req: Request, res: Response, next: NextFunction) => {
  const userId = req.session!.userId;

  try {

    const answer: IAnswer = {}

    switch(byWho) {
      case 'byCandidate' :
        await updateNotificationsCandidate(category, userId);
        break;
      case 'byRecruiter':
        await updateNotificationsRecruiter(category, userId);
        break;
      default :
        throw new Error('texte')
    }

    answer.status = 'ok';
    return res.status(200).json(answer);

  } catch (error) {
    next(error)
  }

}
