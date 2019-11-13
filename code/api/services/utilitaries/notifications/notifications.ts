import {Request, Response, NextFunction} from "express";
import didUserRejectLinkedin from "../../entities/newUser/didUserRejectLinkedin";
import buildNotificationsForRecruiter from './subNotifications/buildNotificationsRecruiter';
import buildNotificationsForCandidate from './subNotifications/buildNotificationsCandidate';
import {TByWho} from "../../interfaces/TypesEntities";
import {IAnswer} from "../../interfaces/InterfaceAnswer";


function setByWho(sessionQuality: string): TByWho {

  try {

    if(sessionQuality === 'candidate') {
      return 'byCandidate';
    } else if(sessionQuality === 'business') {
      return 'byRecruiter';
    } else {
      return 'byVisitor';
    }

  } catch (error) {

    throw error;
  }
}

export default async(req: Request, res: Response, next: NextFunction) => {

  const userId = req.session!.userId || '';
  const quality: string = req.session!.quality || '';

  const answer: IAnswer = {};

  try {

    const byWho: TByWho = setByWho(quality);

    switch(byWho) {

      case "byCandidate":
        answer.data = await buildNotificationsForCandidate(userId);
        break;

      case "byRecruiter":
        answer.data = await buildNotificationsForRecruiter(userId);
        break;

      default:
        answer.data = {};
    }

    answer.status = "ok";

    return res.status(200).json(answer);

  } catch(error) {

    next(error);
  }
};
