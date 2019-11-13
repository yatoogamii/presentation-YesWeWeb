import './App.scss';

import React from "react";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// tools
import abstractGetFetch from './tools/abstractGetFetch';
// Public pages imports
import LandingPage from "./public/LandingPage";
import InfosBusinesses from "./public/InfosBusinesses";
// Shared pages 
import UserEvaluation from "./sharedPages/UserEvaluation";
import ProfileCandidate from "./sharedPages/ProfileCandidate";
import ExternalFeedback from './sharedPages/ExternalFeedback';
import ProfileUserByUser from "./sharedPages/ProfileUserByUser";
// Business pages imports
import BusinessProfileBusiness from "./business/BusinessProfileBusiness";
import BusinessCandidateFinder from "./business/BusinessCandidateFinder";
import BusinessNewMission from "./business/BusinessNewMission";
import BusinessMissions from "./business/BusinessMissions";
import BusinessMatching from "./business/BusinessMatching";
import BusinessMaters from "./business/BusinessTalents";
import BusinessInformations from "./business/BusinessInformations";
import BusinessModifieMission from "./business/BusinessModifieMission";
import BusinessFeedbacks from "./business/BusinessFeedbacks";
// Candidate pages imports
import CandidateProfileMission from "./sharedPages/ProfileMission";
import CandidateMissionFinder from "./candidate/CandidateMissionFinder";
import CandidateFeedbacks from "./candidate/CandidateFeedbacks";
import CandidateMatching from "./candidate/CandidateMatching";
// Shared components imports
import NavBar from "./sharedComponents/NavBar";
import Footer from "./sharedComponents/Footer";
import Window from "./sharedComponents/Window";
import Messaging from './sharedPages/Messaging';
import FourHundredFour from "./sharedPages/FourHundredFour";
import FourHundredThree from "./sharedPages/FourHundredThree";
import Loading from './sharedComponents/Loading';
import Inscription from './public/Inscription';
//
import {IAppState, IAppProps, initialState} from './interfaces/IApp';
import Updated from "./sharedComponents/Updated";
import PuppetLogin from "./public/PuppetLogin";
import BusinessDashboard from "./business/BusinessDashboard";
import BusinessTalents from "./business/BusinessTalents";
import CandidateOpportunities from "./candidate/candidateOpportunities";


export default class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {

    super(props);

    this.state = initialState;

    this.showUpdatedSuccessfull = this.showUpdatedSuccessfull.bind(this);
    this.toggleWindowVisibility = this.toggleWindowVisibility.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setSubPage = this.setSubPage.bind(this);
  }

  componentDidMount() {
    this.setSession();
    this.getNotifications();
    this.setEscapeKeyListener();
  }

  async setSession() {
    try {
      const fetchedSession: any = await abstractGetFetch("/me");
      console.log(fetchedSession);
      this.setState({
        pageStatus: 'ok',
        space: fetchedSession.data.space || 'public',
        firstName: fetchedSession.data.firstName || '',
        lastName: fetchedSession.data.lastName || '',
        businessName: '',
        mode: fetchedSession.data.mode || '',
        businessAvatar: fetchedSession.data.businessAvatar || '',
        userAvatar: fetchedSession.data.userAvatar || '',
      });

    } catch(error) {
      this.setState({space: 'public',});
    }
  }

  async getNotifications() {
    try {
      const notifications: any = await abstractGetFetch('/notifications');
      console.log(notifications);
      this.setState({notifications: notifications.data,});
    } catch(error) {
      this.setState({notifications: {},});
    }
  }

  setPage(page: IAppState["page"]) {
    if(page !== this.state.page) {
      console.log(`page: ${page}`);
      this.setState({page: page,});
    }
  }

  setSubPage(subPage: IAppState["subPage"]) {
    if(subPage !== this.state.subPage) {
      console.log(`subPage: ${subPage}`);
      this.setState({subPage: subPage,});
    }
  }

  setEscapeKeyListener() {
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {this.setState({isWindowVisible: false, windowOptions: {},});}
    });
  }

  toggleWindowVisibility(options: any, open: boolean | null = null) {
    if(open !== null) {
      if(!open) {
        this.setState({isWindowVisible: false, windowOptions: {}});
      } else {
        this.setState({isWindowVisible: true, windowOptions: options});
      }
    } else {
      this.setState({isWindowVisible: !this.state.isWindowVisible, windowOptions: options,});
    }
  }

  showUpdatedSuccessfull() {
    this.setState({infoUpdated: true,}, () => {
      setTimeout(() => { this.setState({infoUpdated: false,}); }, 1400);
    });
  }

  render() {

    const defaultPropsFromApp: any = {
      appState: this.state,
      setPage: this.setPage,
      setSubPage: this.setSubPage,
      showUpdatedSuccessfull: this.showUpdatedSuccessfull,
      toggleWindowVisibility: this.toggleWindowVisibility,
    };

    switch(this.state.space) {

      case 'candidate':
        return (
          <>
            <MainLayout {...defaultPropsFromApp} >

              <Route exact path="/" render={(componentProps) => <CandidateMissionFinder
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_findmission"/>}/>

              <Route path="/candidat/trouver/mission" render={(componentProps) => <CandidateMissionFinder
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_findmission"/>}/>

              <Route path="/candidat/matching" render={(componentProps) => <CandidateMatching
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_matching"/>}/>

              <Route path="/candidat/postes" render={(componentProps) => <CandidateOpportunities
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_opportunities"/>}/>

              <Route path="/candidat/feedbacks" render={(componentProps) => <CandidateFeedbacks
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_feedbacks"/>}/>

              <Route exact path="/candidat/profil" render={(componentProps) => <ProfileUserByUser
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="c_myprofile" byWho="candidate"/>}/>

              <Route exact path="/candidat/mission/:missionid" render={(componentProps) => <CandidateProfileMission
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="c_missionprofile"/>}/>

              <Route exact path="/candidat/avis" render={(componentProps) => <UserEvaluation
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="c_evaluation"/>}/>}

            </MainLayout>
          </>
        );

      case 'business':

        return (
          <>
            <MainLayout {...defaultPropsFromApp}>

              <Route exact path="/" render={(componentProps) => <BusinessDashboard
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page={"r_dashboard"}/>}/>

              <Route exact path="/entreprise/nouvelle/mission" render={(componentProps) => <BusinessNewMission
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page={"r_newmission"}/>}/>

              <Route exact path="/entreprise/missions" render={(componentProps) => <BusinessMissions
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page={"r_missions"}/>}/>

              <Route exact path="/entreprise/trouver/candidats/:missionid" render={(componentProps) => <BusinessCandidateFinder
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page={"r_candidatefinder"}/>}/>

              <Route path="/entreprise/matching" render={(componentProps) => <BusinessMatching
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page={"r_matching"} notifications={this.state.notifications}/>}/>

              <Route path="/entreprise/recrutements" render={(componentProps) => <BusinessTalents
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="r_recruiting"/>}/>

              <Route path="/entreprise/feedbacks" render={(componentProps) => <BusinessFeedbacks
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_feedbacks"/>}/>

              <Route exact path="/entreprise/profil/perso" render={(componentProps) => <ProfileUserByUser
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_myprofile" byWho="business"/>}/>

              <Route exact path="/entreprise/profil" render={(componentProps) => <BusinessProfileBusiness
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_mybusinessprofile"/>}/>

              <Route exact path="/entreprise/modifier/mission/:missionid" render={(componentProps) => <BusinessModifieMission
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_mymissionprofile"/>}/>

              <Route exact path="/entreprise/mission/:missionid/cv/:candidateid" render={(componentProps) => <ProfileCandidate
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={true} page="r_cvcandidate" byWho="business"/>}/>

              <Route path="/entreprise/informations" render={(componentProps) => <BusinessInformations
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_infos"/>}/>

              <Route path="/entreprise/avis" render={(componentProps) => <UserEvaluation
                {...componentProps} {...defaultPropsFromApp} canPageBeBlocked={false} page="r_evaluation"/>}/>} />

            </MainLayout>
          </>
        );

      case 'public':

        return (
          <>
            <MainLayout {...defaultPropsFromApp}>

              <Route exact path="/" render={(componentProps) => <LandingPage
                {...componentProps} {...defaultPropsFromApp} page="lp_infoscandidates"/>}/>

              <Route exact path="/infos/entreprises" render={(componentProps) => <InfosBusinesses
                {...componentProps} {...defaultPropsFromApp} page="lp_infosrecruiters"/>}/>

              <Route exact path="/inscription" render={(componentProps) => <Inscription
                {...componentProps} {...defaultPropsFromApp} page="lp_subscribe"/>}/>

              <Route exact path={"/puppet"} render={(componentProps) => <PuppetLogin
                {...componentProps} {...defaultPropsFromApp} page={"lp_puppet"}/>}/>

            </MainLayout>
          </>
        );

      default:
        return (<><Loading fullpage={true}/></>);
    }
  }
}

function MainLayout(props: any) {

  return (
    <>
      <Router>

        <Window {...props}/>
        <Updated {...props}/>

        <main className={`
          ${(props.appState.space === 'public' && props.appState.page === 'lp_infoscandidates') ? "main-lp-candidate" : ""} 
          ${(props.appState.space === 'public' && props.appState.page === 'lp_infosrecruiters') ? "main-lp-recruiter" : ""}
          ${props.appState.space === 'business' ? "main-business" : ""}
          ${props.appState.space === 'candidate' ? "main-candidate" : ""}
          ${props.appState.isWindowVisible ? "blured" : ""}`}>

          {/* This navbar will only show up when space is not public */}
          <NavBar {...props}/>

          <Switch>

            {/* Specific pages ------------------------------------------------- */}
            {props.children}

            {/* Common pages --------------------------------------------- */}

            <Route exact path="/partage/cv/:token" render={(componentProps) => <ProfileCandidate
              {...componentProps} {...props} canPageBeBlocked={false} page="cvcandidate" byWho="guest"/>}/>

            <Route exact path="/feedback/candidat/:token" render={(componentProps) => <ExternalFeedback
              {...componentProps} {...props} canPageBeBlocked={false} page="externalfeedbacktouser" type="candidate"/>}/>

            <Route exact path="/feedback/recruteur/:token" render={(componentProps) => <ExternalFeedback
              {...componentProps} {...props} canPageBeBlocked={false} page="externalfeedbacktouser" type="recruiter"/>}/>

            <Route exact path="/feedback/entreprise/:token" render={(componentProps) => <ExternalFeedback
              {...componentProps} {...props} canPageBeBlocked={false} page="externalfeedbacktobusiness" type="business"/>}/>

            <Route exact path="/interdit" render={(componentProps) => <FourHundredThree
              {...componentProps} {...props} canPageBeBlocked={false} page="fourhundredthree"/>}/>

            <Route render={(componentProps) => <FourHundredFour
              {...componentProps} {...props} canPageBeBlocked={false} page="fourhundredfour"/>}/>

          </Switch>

          <Footer {...props}/>

        </main>

      </Router>
    </>
  );
}
