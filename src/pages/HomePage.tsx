import React from 'react'
import Home from './Home'
import "./HomePage.scss"
import { IonApp, IonCol, IonRouterOutlet, IonRow } from '@ionic/react'
import { GrMail } from 'react-icons/gr';
import { HiHome, HiMail, HiOutlineHome, HiOutlineMail } from 'react-icons/hi';
import { FaHandshakeSimple } from 'react-icons/fa6';
import { AuthService } from '../services/AuthService';
import { BiHomeCircle, BiSolidHomeCircle } from 'react-icons/bi';
import { BsSearchHeartFill, BsSearchHeart } from 'react-icons/bs';
import { FaRegHandshake } from 'react-icons/fa';
import { GiSettingsKnobs } from 'react-icons/gi';
import { Route, useHistory } from 'react-router';
import ChatList from './ChatList';




const HomePage = () => {
  const history = useHistory()




  return (
    <IonApp className='home-page' style={{}}>
      <IonRouterOutlet>
        {/* {history.location.pathname === "/" && (<Home />)} */}
        {/* {history.location.pathname === "/chat-list" && (<ChatList />)} */}

        <Route exact path="/" component={Home} />
        <Route exact path="/chat-list" component={ChatList} />
          
{/* 
        <Route exact path="/">
          <Home />
        </Route> */}



        {/* {!isScrolling ? */}
        {/* : ""} */}
      </IonRouterOutlet>
        <IonRow className='main-tab-container'>
          <IonCol className='tab-col-box'

            onClick={() => {
              console.log('home clicked');

              history.push("/")
            }}
          >
            {history.location.pathname === "/" ? <BiSolidHomeCircle size={30} /> : <BiHomeCircle size={30} />}
            <p className='col-text'>Home</p>
          </IonCol>

          <IonCol className='tab-col-box'
            onClick={() => {
              history.push("/")
            }}
          >
            {history.location.pathname === "/search" ? <BsSearchHeartFill size={30} /> : <BsSearchHeart size={30} />}
            <p className='col-text'>Search</p>
          </IonCol>

          <IonCol className='tab-col-box'
            onClick={() => {
              history.push("/")
            }}
          >
            {history.location.pathname === "/search" ? <FaHandshakeSimple size={30} /> : <FaRegHandshake size={30} />}
            <p className='col-text'>Request</p>
          </IonCol>

          <IonCol className='tab-col-box'
            onClick={() => {
              console.log('chat-list clicked');
              history.push("/chat-list")
            }}
          >
            {history.location.pathname === "/chat-list" ? <HiMail size={30} /> : <HiOutlineMail size={30} />}
            <p className='col-text'>Message</p>
          </IonCol>

        </IonRow>
    </IonApp>
  )
}

export default HomePage