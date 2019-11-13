import express = require("express");
import {Request, Response, NextFunction} from "express";

import http from "http";
import path from "path";
import helmet from "helmet";
import logger from "morgan";
import bodyParser from "body-parser";
import session from "express-session";


if(process.env.NODE_ENV !== "production") {
  if(!require("dotenv").config()) {
    throw new Error("You must add a .env file.");
  }
}
import ConsoleFormater from "./tools/consoleFormater";
import LinkedinTool from "./tools/linkedinTool";
import database from "./tools/database";
import Slacker from "./tools/slacker";
import Mailer from "./tools/mailer";


const app: express.Application = express();
const mongoDBStore = require("connect-mongodb-session")(
  require("express-session")
);

const DIRAPI = path.resolve(__dirname);
const CLIENT =
  process.env.NODE_ENV !== "production"
    ? path.join(DIRAPI, "..", "client")
    : path.join(DIRAPI, "client");
const PORT = process.env.PORT || 8080;

//////////////////////////////////////////////////////////////////

const expressSessionSetup = {
  secret: process.env.SESSION_SECRET!,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: new mongoDBStore({
                            uri: process.env.SESSION_URI!,
                            collection: process.env.SESSION_COLLECTION!
                          }),
  name: process.env.SESSION_NAME!,
  saveUninitialized: true,
  resave: true
};

const helmetSetup = {};

Mailer.setup({
               host: process.env.MAIL_1_HOST!,
               port: Number(process.env.MAIL_1_PORT!)
             });

LinkedinTool.setup({
                     linkedinId: process.env.LINKEDIN_ID!,
                     linkedinSecret: process.env.LINKEDIN_PASS!,
                     state: process.env.LINKEDIN_STATE!,
                     scope: "r_liteprofile%20r_emailaddress%20w_member_social"
                   });

Slacker.setup({slackToken: process.env.SLACK_BOT_TOKEN!});

const Stanislas = new Mailer({
                               mailBot: process.env.MAIL_3_ADDRESS!,
                               passwordBot: process.env.MAIL_3_PASSWORD!,
                               nameBot: process.env.MAIL_3_NAME!
                             });
const Aurelie = new Mailer({
                             mailBot: process.env.MAIL_2_ADDRESS!,
                             passwordBot: process.env.MAIL_2_PASSWORD!,
                             nameBot: process.env.MAIL_2_NAME!
                           });
const Lise = new Mailer({
                          mailBot: process.env.MAIL_1_ADDRESS!,
                          passwordBot: process.env.MAIL_1_PASSWORD!,
                          nameBot: process.env.MAIL_1_NAME!
                        });

const linkedin = new LinkedinTool();
const slack = new Slacker();
slack.verifyConnection();

database(process.env.DATABASE_URL!);

//////////////////////////////////////////////////////////////////////////

// COMPONENTS OF THE SERVICE : Entities --------------------------------------------------------------
// Users profiles
import getUserProfile from "./services/entities/users/getUserProfile";
import refreshUserStatus from "./services/entities/users/refreshUserStatus";
import updateUserGlobal from "./services/entities/users/updateUserGlobal";
import updateUserArray from "./services/entities/users/updateUserArray";
// Businesses profiles
import getBusinessProfile from "./services/entities/businesses/getBusinessProfile";
import updateBusinessGlobal from "./services/entities/businesses/updateBusinessGlobal";
import updateBusinessArray from "./services/entities/businesses/updateBusinessArray";
// missions
import postNewMission from "./services/entities/missions/postNewMission";
import getListMissionsByBusiness from "./services/entities/missions/getListMissionsByBusiness";
import getMissionProfile from "./services/entities/missions/getMissionProfile";
import updateMissionGlobal from "./services/entities/missions/updateMissionGlobal";
// login
import loginLinkedin from "./services/entities/login/loginLinkedin";
import logout from "./services/entities/login/logout";
// new user
import didUserRejectLinkedin from "./services/entities/newUser/didUserRejectLinkedin";
import newUser from "./services/entities/newUser/newUser";

// COMPONENTS OF THE SERVICE : Matching --------------------------------------------------------------
import shareCandidate from "./services/matching/share/shareCandidate";
import addCommentToCandidate from "./services/matching/share/addCommentToCandidate";
import getAllCommentsOnCandidate from "./services/matching/share/getAllCommentsOnCandidate";
import addMessage from "./services/matching/messaging/addMessage";
import getListMessages from "./services/matching/messaging/getListMessages";
import getMatches from "./services/matching/matching/getMatches";
import updateContract from "./services/matching/contracts/updateContract";
import getMissionsCandidateWasLiked from "./services/matching/matching/getMissionsCandidateWasLiked";
import toggleLike from "./services/matching/matching/toggleLike";
import isCandidateLiked from "./services/matching/matching/isCandidateLiked";
// Contracts
import getInfosForContract from "./services/matching/contracts/getInfosForContract";

// COMPONENTS OF THE SERVICE : Machine --------------------------------------------------------------
import algoAurelie from "./services/machine/algoAurelie";
import algoLise from "./services/machine/algoLise";

// COMPONENTS OF THE SERVICE : Utilitaries --------------------------------------------------------------
//notifications
import notifications from "./services/utilitaries/notifications/notifications";
import updateNotifications from "./services/utilitaries/notifications/updateNotifications";
// cors
import cors from "./services/utilitaries/cors/cors";
// session
import initSession from "./services/utilitaries/session/initSession";
import whoami from "./services/utilitaries/session/whoami";
import pong from './services/utilitaries/session/pong';
// temporaryLp
import isDev from "./services/utilitaries/temporaryLp/isDev";
import loginDev from "./services/utilitaries/temporaryLp/loginDev";
import subscribeTemp from "./services/utilitaries/temporaryLp/subscribeTemp";
// rights to access required api
import isMaster from "./services/utilitaries/rights/isMaster";
import isIdentified from "./services/utilitaries/rights/isIdentified";
import isBusiness from "./services/utilitaries/rights/isBusiness";
import isCandidate from "./services/utilitaries/rights/isCandidate";
import isUserAllowedToModifyMission from "./services/utilitaries/rights/isUserAllowedToModifyMission";
import canCommentCandidate from "./services/utilitaries/rights/canCommentCandidate";

// COMPONENTS OF THE SERVICE : Calendar --------------------------------------------------------------
import updatdeCalendar from "./services/calendar/updateCalendar";
import getCalendar from "./services/calendar/getCalendar";

// COMPONENTS OF THE SERVICE : Feedbacks --------------------------------------------------------------
import identifyGuestForFeedback from './services/feedbacks/linkedinCbForExternalFeedbacks';
//
import puppet from './services/utilitaries/puppet/puppet';
import getContracts from "./services/matching/contracts/getContracts";
import filterUserProfile from "./services/entities/users/filterUserProfile";
import filterBusinessProfile from "./services/entities/businesses/filterBusinessProfile";
import filterMissionProfile from "./services/entities/missions/filterMissionProfile";
import linkedinCallbackForExternalFeedbacks from "./services/feedbacks/linkedinCbForExternalFeedbacks";
import getProfileForExternalFeedback from "./services/feedbacks/getProfileForExternalFeedback";
import postExternalFeedback from "./services/feedbacks/postExternalFeedback";
import getFeedbacks from "./services/feedbacks/getFeedbacksOn";
import isAlreadyCommentedByGuest from "./services/matching/share/isAlreadyCommentedByGuest";
import askForExternalFeedback from "./services/feedbacks/askForExternalFeedback";
import getFeedbacksOn from "./services/feedbacks/getFeedbacksOn";
import getMyFeedbacks from "./services/feedbacks/getMyFeedbacks";
import getPendingFeedbacks from "./services/feedbacks/getPendingFeedbacks";

// LOADING STATIC PAGES
const staticClient = express.static(path.join(CLIENT, 'build'));

// throw new Error ('Ceci est une super erreur 2');

/////////////////////////////////////////////////////////////////////////
app.use(helmet(helmetSetup));
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "1mb"}));
app.use(logger("[:date[clf]] - :remote-addr - :method - :url - :status - :response-time ms"));
app.use(cors);
app.use(session(expressSessionSetup));

////////////////////////////////////////////////////////////////

app.get('/', initSession(linkedin));
app.use('/', staticClient);
app.get('/', (req, res, next) => res.sendFile(path.join(CLIENT, 'build')));

////////////////////////////////////////////////////////////////

// ENDPOINTS FOR SERVICES

// ENDPOINTS FOR THE SERVICE : Entities
// Users
// New user and login
app.get("/oAuth/v2/linkedin", didUserRejectLinkedin, loginLinkedin(linkedin, null));
app.get("/oAuth/v2/linkedin/entreprise", didUserRejectLinkedin, loginLinkedin(linkedin, "business"), newUser(Lise, slack));
app.get("/oAuth/v2/linkedin/candidat", didUserRejectLinkedin, loginLinkedin(linkedin, "candidate"), newUser(Lise, slack));
// get
app.get("/ent/u/userprofile", isIdentified, getUserProfile("byUser"), filterUserProfile('byUser'));
app.get("/ent/r/userprofile", isBusiness, getUserProfile("byRecruiter"), filterUserProfile('byRecruiter'));
app.get("/ent/r/recruiterprofile", isCandidate, getUserProfile("byCandidate"), filterUserProfile('byCandidate'));
app.get("/ent/g/userprofile", canCommentCandidate, getUserProfile("byCoworker"), filterUserProfile('byCoworker'));
app.get("/ent/v/userprofile", getUserProfile("byVisitor"), filterUserProfile('byVisitor'));
// update
app.put("/ent/u/updateprofile/global", isIdentified, updateUserGlobal);
app.put("/ent/u/updateprofile/array", isIdentified, updateUserArray);
app.put("/ent/u/updateprofile/refresh", isIdentified, refreshUserStatus);
// Businesses
// get
app.get("/ent/r/businessprofile", isBusiness, getBusinessProfile("byRecruiter"), filterBusinessProfile('byRecruiter'));
app.get("/ent/c/businessprofile", isCandidate, getBusinessProfile("byCandidate"), filterBusinessProfile('byCandidate'));
app.get("/ent/g/businessprofile", getBusinessProfile("byGuest"), filterBusinessProfile('byGuest'));
app.get("/ent/v/businessprofile", getBusinessProfile("byVisitor"), filterBusinessProfile('byVisitor'));
// update
app.put("/ent/r/updateprofile/global", isBusiness, updateBusinessGlobal);
app.put("/ent/r/updateprofile/array", isBusiness, updateBusinessArray);
// Missions
// post
app.post("/ent/r/newmission", isBusiness, postNewMission(Aurelie));
// get a list of missions
app.get("/ent/r/missionslist", isBusiness, getListMissionsByBusiness);
// get
app.get("/ent/r/missionprofile", isBusiness, getMissionProfile("byRecruiter"), filterMissionProfile('byRecruiter'));
app.get("/ent/c/missionprofile", isCandidate, getMissionProfile("byCandidate"), filterMissionProfile('byCandidate'));
app.get("/ent/g/missionprofile", getMissionProfile("byGuest"), filterMissionProfile('byGuest'));
app.get("/ent/v/missionprofile", getMissionProfile("byVisitor"), filterMissionProfile('byVisitor'));
// update
app.put("/ent/r/m/profileupdate/global", isBusiness, isUserAllowedToModifyMission, updateMissionGlobal);
// Session
app.get("/me", whoami(process.env.MODE));
app.get("/ping", pong);
app.get("/logout", logout);

// COMPONENTS OF THE SERVICE : Machine
app.get("/lise", isBusiness, algoLise);
app.get("/aurelie", isCandidate, algoAurelie);

// COMPONENTS OF THE SERVICE : Matching
// share a cv
app.post("/share/r", isBusiness, shareCandidate(Lise));
app.post("/share/g/addcomment", canCommentCandidate, addCommentToCandidate);
app.get("/share/r/getcomments", isBusiness, getAllCommentsOnCandidate);
app.get("/share/g/already/commented", isAlreadyCommentedByGuest);
// like system
app.put("/like/r", isBusiness, toggleLike("byRecruiter"));
app.put("/like/c", isCandidate, toggleLike("byCandidate"));
app.get("/isliked", isBusiness, isCandidateLiked);
// get matches
app.get("/match/c/allmatches", isCandidate, getMatches("byCandidate"));
app.get("/match/b/allmatches", isBusiness, getMatches("byRecruiter"));
// get contracts
app.get('/match/c/allcontracts', isBusiness, getContracts('byCandidate'));
app.get('/match/r/allcontracts', isBusiness, getContracts('byRecruiter'));
// Matching
app.get("/match/c/wholikedme", isCandidate, getMissionsCandidateWasLiked);
// app.get('/match/r/wholikedme', isBusiness, getMissionsCandidateWasLiked);
// Interview
app.get("/msg/getall", getListMessages);
app.post("/msg/add", addMessage);
// Contracts

app.get("/contract/r/cddcdi/get/infos", getInfosForContract("byRecruiter"));
app.get("/contract/c/cddcdi/get/infos", getInfosForContract("byCandidate"));
app.put("/contract/r/offer", updateContract("offer"));
app.put("/contract/r/withdraw", updateContract("withdraw"));
app.put("/contract/c/accept", updateContract("accept"));
app.put("/contract/c/refuse", updateContract("refuse"));

// COMPONENTS OF THE SERVICE : Calendar
app.get("/cal/get", isCandidate, getCalendar);
app.put("/cal/update", isCandidate, updatdeCalendar);

// COMPONENTS OF THE SERVICE : External Feedbacks
// Ask for a feedback
app.put("/feedbacks/c/asks", isCandidate, askForExternalFeedback(linkedin, Lise, 'toCandidate'));
app.put("/feedbacks/r/asks", isBusiness, askForExternalFeedback(linkedin, Aurelie,'toRecruiter'));
app.put("/feedbacks/b/asks", isBusiness, askForExternalFeedback(linkedin, Aurelie,'toBusiness'));
// Ask for my pending feedbacks
app.get("/feedbacks/c/pending", getPendingFeedbacks('toCandidate'));
app.get("/feedbacks/r/pending", getPendingFeedbacks('toRecruiter'));
app.get("/feedbacks/b/pending", getPendingFeedbacks('toBusiness'));
// Linkedin callbacks
app.get("/oAuth/v2/linkedin/feedback/i/candidat", didUserRejectLinkedin, linkedinCallbackForExternalFeedbacks(linkedin, "toCandidate"));
app.get("/oAuth/v2/linkedin/feedback/i/recruteur", didUserRejectLinkedin, linkedinCallbackForExternalFeedbacks(linkedin, "toRecruiter"));
app.get("/oAuth/v2/linkedin/feedback/i/entreprise", didUserRejectLinkedin, linkedinCallbackForExternalFeedbacks(linkedin, "toBusiness"));
// Guest gets user profile
app.get("/feedbacks/ext/g/get/candidate", getProfileForExternalFeedback("toCandidate"));
app.get("/feedbacks/ext/g/get/recruiter", getProfileForExternalFeedback("toRecruiter"));
app.get("/feedbacks/ext/g/get/business", getProfileForExternalFeedback("toBusiness"));
// Guest sends a feedback
app.put("/feedback/ext/to/candidate", postExternalFeedback("toCandidate"));
app.put("/feedback/ext/to/recruiter", postExternalFeedback("toRecruiter"));
app.put("/feedback/ext/to/business", postExternalFeedback("toBusiness"));
// User gets feedbacks on him/her
app.get("/feedbacks/c/get/my", getMyFeedbacks('toCandidate'));
app.get("/feedbacks/r/get/my", getMyFeedbacks('toRecruiter'));
app.get("/feedbacks/b/get/my", getMyFeedbacks('toBusiness'));
// Anyone gets feedbacks on user
app.get('/feedbacks/get/on', isBusiness, getFeedbacksOn('toCandidate'));
app.get('/feedbacks/get/on', isCandidate, getFeedbacksOn('toRecruiter'));
app.get('/feedbacks/get/on', isCandidate, getFeedbacksOn('toBusiness'));

// ENDPOINTS FOR THE SERVICE : Notifications
app.get('/notifications', notifications);
app.put('/notifications/c/match', updateNotifications('byCandidate', 'match'));
app.put('/notifications/r/match', updateNotifications('byRecruiter', 'match'));
app.put('/notifications/c/contract/offered', updateNotifications('byCandidate', 'contractOffered'));
app.put('/notifications/r/contract/accepted', updateNotifications('byRecruiter', 'contractAccepted'));
// app.put('/notifications/c/match/withdrawed', updateNotifications('byCandidate', 'contractRefused'));
app.put('/notifications/r/contract/refused', updateNotifications('byRecruiter', 'contractRefused'));

// ENDPOINTS FOR THE SERVICE : Logs

// Puppet login
////////////////////////////////////////
// if(process.env.MODE !== "production") {
  app.post("/puppet/login", puppet("login"));
  app.post("/puppet/candidat", puppet("candidat"));
  app.post("/puppet/entreprise", puppet("entreprise"));
// }
//////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////////

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if(res.headersSent) {
    return next(error);
  } else {

    ConsoleFormater.test(
      `ERROR ${error.message}, {status: 'error'} was sent to the client.`
    );
    console.log(error);

    return res.status(500).json({status: "error"});
  }
});

app.use("*", staticClient);

///////////////////////////////////////////////////////////////////////////////////

// RUN SERVER
http.createServer(app).listen(PORT, () => {

  ConsoleFormater.success(`Server is listening on port ${PORT}`);
});
