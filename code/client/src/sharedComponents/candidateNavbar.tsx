import React from 'react'
import { Link } from "react-router-dom"

import capitalize from './../../tools/capitalize';

interface navProps {
  [key: string]: any;
}

function checkNotificationsMatches(notifications: any) {
  try {
    if(notifications.matches.length > 0) {
      for(const match of notifications.matches) {
        if(match.seenByCandidate === false) {
          return 'notifications-navbar'
        } else {
          continue;
        }
      }
      return '';
    } else {
      return '';
    }
  } catch(error) {

    return '';
  }
}

function checkNotificationsContractsOffered(notifications: any) {
  try {
    if(notifications.contracts.length > 0) {
      for(const contract of notifications.contracts) {
        if(contract.seenByCandidate === false && contract.contractStatus === 'offered') {
          return 'notifications-navbar'
        } else {
          continue;
        }
      }
      return '';
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
}

function openNavbar() {
  const mobileNavbar = document.querySelector('.navbar-mobile__list');
  mobileNavbar!.classList.replace('navbar-mobile__list--close', 'navbar-mobile__list--open');
}

function closeNavbar() {
  const mobileNavbar = document.querySelector('.navbar-mobile__list');
  mobileNavbar!.classList.replace('navbar-mobile__list--open', 'navbar-mobile__list--close');
}

function toggleSubNavbar(event: any) {
  const subLink = event.target;

  if (subLink.tagName === 'UL') {
    subLink.classList.toggle('navbar-mobile__list__item--close');
    subLink.classList.toggle('navbar-mobile__list__item--open');
  } else {
    subLink.parentElement.classList.toggle('navbar-mobile__list__item--open');
    subLink.parentElement.classList.toggle('navbar-mobile__list__item--close');
  }
}

export default function CandidateNav(props: navProps): any {

  // return (
  //   <div className="navbar-space">
  //   <nav className="navbar navbar-candidate">
  //     <Link className="navbar-candidate__logo" to="/">
  //       b<span className="text--light-blue">-</span>
  //     </Link>
  //     <ul className="navbar-candidate__list">
  //       <li className="navbar-candidate__element">
  //         <Link to="/">
  //           Mon prochain challenge
  //               </Link>
  //       </li>
  //       <li className="navbar-candidate__element">
  //         <Link to="/candidat/matching">
  //           Mes matchs
  //               </Link>
  //       </li>
  //       <li className="navbar-candidate__element">
  //         <Link to="/candidat/agenda">
  //           Agenda
  //               </Link>
  //       </li>
  //       <li className="navbar-candidate__element">
  //         <DropDown />
  //         <Link to="/candidat/profil">
  //           <img src="/assets/avatar-placeholder.jpg" alt="avatar profil" />
  //           <p>{props.appState.firstName} {props.appState.lastName}</p>
  //         </Link>
  //         <i className="fas fa-ellipsis-v"></i>
  //       </li>
  //     </ul>
  //   </nav>
  //   </div>
  // )

  return (
    <div className="navbar-space">
      <nav className="navbar">

        <span className="navbar__logo">
          <Link to="/">
            b<span className="text--light-blue">-</span>
          </Link>
          <span className="navbar__logo__space-name">
            Candidat
          </span>
        </span>

        <ul className="navbar__list">
          <li className="navbar__list__item">
            <Link className={`${props.appState.page === 'c_findmission' ? 'underline text--bold' : 'underline-hover' } underline--black`} to="/">
              Prochain challenge
                  </Link>
          </li>
          <li className="navbar__list__item">
            <Link className={`${checkNotificationsContractsOffered(props.appState.notifications)} ${checkNotificationsMatches(props.appState.notifications)} ${props.appState.page === 'c_matching' ? 'underline text--bold' : 'underline-hover' } underline--black`} to="/candidat/matching">
              Matchs
            </Link>
          </li>
          <li className="navbar__list__item">
            <Link className={`${props.appState.page === 'c_opportunities' ? 'underline text--bold' : 'underline-hover' } underline--black`} to="/candidat/postes">
              Dashboard
            </Link>
          </li>
          <li className="navbar__list__item navbar-trigger-dropdown">

          <DropDown page={props.appState.page} />
            <Link to="/candidat/profil">
              <img className="navbar__avatar" src={props.appState.userAvatar} />
              <span className="navbar__name">{capitalize(props.appState.firstName)}</span>
              <span><i className="fas fa-ellipsis-v"></i></span>
            </Link>
          </li>

        </ul>

      </nav>

      {/* mobile navbar */}
      <nav className="navbar-mobile">

      <div className="navbar-mobile__burger">
        <i onClick={openNavbar} className="fas fa-bars"></i> 
      </div>

      <span className="navbar__logo">
        <Link to="/">
          b<span className="text--light-blue">-</span>
        </Link>
        <span className="navbar__logo__space-name">
          Entreprise
        </span>
      </span>

      <ul className="navbar-mobile__list navbar-mobile__list--close">

        <li className="navbar-mobile__burger">
          <i onClick={closeNavbar} className="fas fa-times"></i>
        </li>

        <ul className="navbar-mobile__list__item navbar-mobile__list__item--close">
          <Link onClick={toggleSubNavbar} className={`${props.appState.page === 'c_findmission' ? 'navbar-mobile__list__item--active' : '' } `} to="#">
            Prochain challenge
          </Link>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_missions' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/trouver/mission">
              Lise vous propose
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_urgentmissions' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/trouver/mission/urgent">
              Voir les propositions reçues
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_urgentmissions' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/trouver/mission/likes">
              Likes reçus
            </Link>
          </li>
        </ul>

        <li className="navbar-mobile__list__item">
          <Link onClick={closeNavbar} className={`${checkNotificationsContractsOffered(props.appState.notifications)} ${checkNotificationsMatches(props.appState.notifications)} ${props.appState.page === 'c_matching' ? 'navbar-mobile__list__item--active' : '' } `} to="/candidat/matching">
            Mes matchs
          </Link>
        </li>

        <li className="navbar-mobile__list__item">
          <Link onClick={closeNavbar} className={`${props.appState.page === 'c_video' ? 'navbar-mobile__list__item--active' : '' } `} to="/candidat/matching/video">
            Mes entretiens vidéo
          </Link>
        </li>

        <ul className="navbar-mobile__list__item navbar-mobile__list__item--close">
          <Link onClick={toggleSubNavbar} className={`${props.appState.page === 'c_video' ? 'navbar-mobile__list__item--active' : '' } `} to="#">
            Mes opportunitées
          </Link>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_contracts' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/postes">
              Mes contrats
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_agenda' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/postes/agenda">
              Mes postes
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_hours' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/postes/heures">
              Déclaration des heures
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_billing' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/postes/paies">
              Fiches de paie
            </Link>
          </li>
        </ul>

        <ul className="navbar-mobile__list__item navbar-mobile__list__item--close">
          <Link onClick={toggleSubNavbar} className={`${props.appState.page === 'c_feedbacks' ? 'navbar-mobile__list__item--active' : '' } `} to="#">
            Feedbacks
          </Link>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_asksfeedbacks' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/feedbacks">
              Demandes de feedback
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_givesfeedbacks' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/feedbacks/en/attente">
              Feedbacks en attente
            </Link>
          </li>

          <li className="navbar-mobile__list__sub-item">
            <Link onClick={closeNavbar} className={`${props.appState.subPage === 'c_seesnfeedbacks' ? 'navbar-mobile__list__sub-item--active' : '' } `} to="/candidat/feedbacks/tous">
              Mes feedbacks
            </Link>
          </li>
        </ul>

        <li className="navbar-mobile__list__item">
          <Link onClick={closeNavbar} className={`${props.appState.page === 'c_myprofile' ? 'navbar-mobile__list__item--active' : '' } `} to="/candidat/profil">
            Mon profil
          </Link>
        </li>

        <li className="navbar-mobile__list__item">
          <Link onClick={closeNavbar} className={`${props.appState.page === 'c_evaluation' ? 'navbar-mobile__list__item--active' : '' } `} to="/candidat/avis">
            Votre avis sur black-belt.io
          </Link>
        </li>

        <li className="navbar-mobile__list__item">
          <a onClick={closeNavbar} className='underline-hover underline--white' href="/logout">
            se déconnecter
          </a>
        </li>

      </ul>

    </nav>
  </div>
  )

}

function DropDown(props: any): any {
  return (
    <ul className="navbar__dropdown">
      <li>
        <Link className={`${props.page === 'c_feedbacks' ? 'underline' : 'underline-hover' } underline--white`} to="/candidat/feedbacks">
          <i className="fas fa-star"></i> Mes feedbacks
        </Link>
      </li>
      <li>
        <Link className={`${props.page === 'c_myprofile' ? 'underline' : 'underline-hover' } underline--white`} to="/candidat/profil">
          Mon profil
        </Link>
      </li>
      <li>
        <Link className={`${props.page === 'c_evaluation' ? 'underline' : 'underline-hover' } underline--white`} to="/candidat/avis">
          Votre avis sur black-belt.io
        </Link>
      </li>
      <li>
        <a className='underline-hover underline--white' href="/logout">
          se déconnecter
        </a>
      </li>
    </ul>
  )
}
