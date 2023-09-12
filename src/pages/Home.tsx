import {
  IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow,
  useIonViewWillEnter,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading
} from '@ionic/react'
import { location, settings } from 'ionicons/icons'
import React, { useState, useContext, useEffect, useRef } from 'react'
import './Home.scss'
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { AppContext } from '../appContext/context';
import { User } from '../model';
import { AuthService } from '../services/AuthService';

import { GiSettingsKnobs } from 'react-icons/gi';

interface OnlineUserResponse {
  socketId: string;
  userId: string;
}





const Home: React.FC = () => {
  const userService = new UserServices()
  const history = useHistory()
  const pageSize = 8

  const authService = new AuthService()
  const { onlineUsers } = useContext(AppContext)
  const [myProfile, setMyProfile] = useState<User>()
  const [users, setUsers] = useState<any>([])
  const [isScrolling, setisScrolling] = useState(false)
  const loadingModal = useRef<any>(null)





  function getMe() {
    userService.getMe()
      .then((user: User) => {
        setMyProfile(user)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  function getAllUsers() {
    loadingModal.current?.present()
    const userId = authService.getUserId()
    if (!userId) return
    userService.getUsers()
      .then((users) => {
        const filterdUsers = users?.filter((user: any) => user?._id !== userId)
        setUsers(filterdUsers)
        loadingModal.current?.dismiss()

      })
      .catch((error) => {
        loadingModal.current?.dismiss()
        console.log('get all users response', error)
      })
  }




  function refresher(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      getAllUsers()
      getMe()
      event.detail.complete()
    }, 2000)
  }


  useIonViewWillEnter(() => {
    getMe()
    getAllUsers()
  })


  return (
    <IonPage className='home-main-container'>
      <IonLoading
        ref={loadingModal}
        message="Loading..."
        spinner="dots"

      />
      <IonHeader>
        <IonRow >
          <IonCol className='home-header-col' >
            <div className="home-local-text">PEOPLE AROUND</div>
            <div className="home-profile-img-container"
              onClick={() => {
                console.log('click')
                history.push(`/profile/${myProfile?._id}`)
              }}
            >

              {
                myProfile?.avatar === "" && myProfile?.gender === '' ?
                  <div className="img-container"
                    style={{ backgroundImage: `url("./assets/images/avatar-other.svg")` }}
                  >
                  </div>
                  :
                  myProfile?.avatar === "" && myProfile?.gender === 'Male' ?
                    <div className="img-container"
                      style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                    >
                    </div>
                    :
                    myProfile?.avatar === "" && myProfile?.gender === 'Female' ?
                      <div className="img-container"
                        style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                      >
                      </div>
                      :

                      <div className='img-container' style={{ backgroundImage: `url(${myProfile?.avatar})` }}>
                      </div>
              }
              {/* <div className="img-container"
                style={{ backgroundImage: `url("./assets/images/obaro.jpg")` }}
              ></div> */}
            </div>
          </IonCol>
        </IonRow>
      </IonHeader>
      <IonRow>
        <IonCol className='home-info-col' >
          <div className="home-info-text">OFFER A DINNER</div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <GiSettingsKnobs size={30} />
          </div>
        </IonCol>
      </IonRow>
      <IonContent
        scrollX={false}
        scrollEvents
        className='home-main-content'
        onIonScrollEnd={() => {
          setisScrolling(!isScrolling);
        }}
        onIonScrollStart={() => {
          setisScrolling(!isScrolling);
        }}
      >



        <IonGrid className='home-user-grid-container'>
          <IonRow>
            {
              users?.map((user: User) => user._id !== myProfile?._id && (
                <IonCol
                  onClick={() => {
                    history.push({ pathname: `/user-profile/${user._id}`, state: user })

                  }}
                  key={user._id}
                  className='home-user-avatar'
                  sizeLg='2.8'
                  sizeMd='3.8'
                  sizeSm='5.8'
                  sizeXs='5.8'
                >
                  {
                    user.avatar === "" && user.gender === '' ? <div className="avatar-container"
                      style={{ backgroundImage: `url("./assets/images/avatar-other.svg")` }}
                    >
                    </div>
                      :
                      user.avatar === "" && user.gender === 'male' ? <div className="avatar-container"
                        style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                      >
                      </div>
                        :
                        user.avatar === "" && user.gender === 'female' ? <div className="avatar-container"
                          style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                        >
                        </div>
                          :

                          <div className='avatar-container' style={{ backgroundImage: `url(${user.avatar})` }}>
                          </div>
                  }
                  <div className={onlineUsers?.some((u: OnlineUserResponse) => u?.userId === user._id) ? 'online' : 'offline'}></div>
                  {/* <div className="online">online</div> */}
                  <div className="home-user-name">{user.firstName} {user.lastName}</div>
                  <div className="age-box info-container">
                    <p>Age</p>
                    <p>{user.age}</p>
                  </div>
                  <div className="gender-box info-container">
                    <p>Gender</p>
                    <p>{user.gender}</p>
                  </div>
                  <div className="location-box info-container" >
                    <p>Location</p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IonIcon icon={location} />
                      <p>{user.state}</p>
                    </div>
                  </div>
                </IonCol>
              ))
            }
          </IonRow>
        </IonGrid>

        <IonRefresher slot='fixed' onIonRefresh={refresher}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      </IonContent>



    </IonPage>
  )
}

export default Home