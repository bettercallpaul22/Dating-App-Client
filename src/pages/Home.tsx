import {
  IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow,
  useIonViewWillEnter,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react'
import { home, location, settings } from 'ionicons/icons'
import React, { useState, useContext, useEffect } from 'react'
import './Home.scss'
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { AppContext } from '../appContext/context';
import { MyChatResponse, User } from '../model';
import { GrMail } from 'react-icons/gr';
import { HiHome, HiMail, HiOutlineHome, HiOutlineMail } from 'react-icons/hi';
import { FaHandshakeSimple } from 'react-icons/fa6';
import { AuthService } from '../services/AuthService';
import { BiHomeCircle, BiSolidHomeCircle } from 'react-icons/bi';
import { BsSearchHeartFill, BsSearchHeart } from 'react-icons/bs';
import { FaRegHandshake } from 'react-icons/fa';
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
  const { socket, onlineUsers } = useContext(AppContext)
  const [myProfile, setMyProfile] = useState<User>()
  const [users, setUsers] = useState<any>([])
  const [index, setIndex] = useState(0)
  const [visibleData, setVisibleData] = useState<any>([])
  const [isScrolling, setisScrolling] = useState(false)

  // function loadMore() {
  //   // setIndex(index + 1)
  //   const newUsers = [];
  //   for (let i = 0; i < 8; i++) {
  //       newUsers.push(1 + users?.length + i)
  //   }
  //   setUsers([...users, ...newUsers])
  // }


  useEffect(() => {
    //   const numberOfItems = pageSize * (index + 1)
    //   const newUsers = [];
    //   for (let i = 0; i < users?.length; i++) {
    //     if (i < numberOfItems)
    //       newUsers.push(users[i])
    //   }
    //   setVisibleData(newUsers)
    // loadMore()
  }, []);








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
    const userId = authService.getUserId()
    if (!userId) return
    userService.getUsers()
      .then((users) => {
        const filterdUsers = users?.filter((user: any) => user?._id !== userId)
        setUsers(filterdUsers)

      })
      .catch((error) => console.log('get all users response', error))
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
        {/* <IonRow>
          <IonCol size='12'>
            <IonText color='primary'>Available Rooms</IonText>
          </IonCol>
          <IonCol className='home-rooms-col'>
            <div className='room-text'>
              <IonText color='primary'> Rooms 1yusujdshhiad</IonText>

            </div>
          </IonCol>
        </IonRow> */}


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
        {/* <IonInfiniteScroll
          onIonInfinite={(ev) => {
            // loadMore()
            // setTimeout(() => {
            //   ev.target.complete()
            // }, 4000)
          }}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll> */}

        <IonRefresher slot='fixed' onIonRefresh={refresher}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      </IonContent>

      {!isScrolling ? <IonRow className='main-tab-container'>

        <IonCol className='tab-col-box'
          onClick={() => {
            history.push("/")
          }}
        >
          {history.location.pathname === "/search" ? <BiSolidHomeCircle size={30} /> : <BiHomeCircle size={30} />}
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
            history.push("/")
          }}
        >
          {history.location.pathname === "/search" ? <HiOutlineMail size={30} /> : <HiMail size={30} />}
          <p className='col-text'>Message</p>
        </IonCol>

      </IonRow> : ""}

    </IonPage>
  )
}

export default Home