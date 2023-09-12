import { Redirect, Route, useHistory, useLocation, useParams } from 'react-router-dom';
import {
  IonApp,
  IonCol,
  IonLabel,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Register from './pages/Register';
// import Home from './pages/Home';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
// import './theme/css-variables.css';
import './theme/variables.scss';
import './App.scss';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import { useEffect, useState } from 'react'
import { setUser } from './features/authSlice';
import ChatList from './pages/ChatList';
import Room from './pages/Room';
import { AppContext } from '../src/appContext/context'
import { UserServices } from './services/UserServices';
import { User } from './model';
import { AuthService } from './services/AuthService';
import { io } from 'socket.io-client'
import UserProfile from './pages/UserProfile';
import ProfileEdit from './pages/ProfileEdit';
import Test from './pages/Test';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import { GrMail } from 'react-icons/gr';
import { HiHome, HiMail, HiOutlineHome, HiOutlineMail } from 'react-icons/hi';
import { FaHandshakeSimple } from 'react-icons/fa6';
import { BiHomeCircle, BiSolidHomeCircle } from 'react-icons/bi';
import { BsSearchHeartFill, BsSearchHeart } from 'react-icons/bs';
import { FaRegHandshake } from 'react-icons/fa';
import { GiSettingsKnobs } from 'react-icons/gi';

interface OnlineUserResponse {
  socketId: string;
  userId: string;
}

// const socketUrl = 
setupIonicReact();

const App: React.FC = () => {
  const history = useHistory()



  const userService = new UserServices()
  const authService = new AuthService()

  const [room, setRoom] = useState([])
  const [currentRoom, setCurrentRoom] = useState([])
  const [allUsers, setAllUsers] = useState<User>()
  const [messageList, setMessageList] = useState([])
  const [privateMessage, setPrivateMessage] = useState({})
  const [newMessage, setNewMessage] = useState({})
  const [socket, setSocket] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserResponse>()
  const [currentLocation, setcurrentLocation] = useState(location.pathname)


  // connecting the socket server
  useEffect(() => {
    const socketServer = (io("http://localhost:5000"))
    setSocket(socketServer)

    return () => {
      socketServer.disconnect()
    }

  }, [currentUserId,])



  // Emitting an event to get online user on socket connection
  useEffect(() => {
    if (!socket) return
    const userId = authService.getUserId() as string
    setCurrentUserId(userId)
    socket.emit('addUser', userId)

  }, [currentUserId, socket])



  // Listening to an event
  useEffect(() => {
    if (!socket) return
    socket.on('onlineUsers', (data: OnlineUserResponse) => {
      setOnlineUsers(data)
    })

  }, [currentUserId, socket])



  // console.log(socket?.id)
  //   console.log('app.js  online user state', onlineUsers)
  console.log('location name', location.pathname)
  // console.log('history', history)
  return (
    <AppContext.Provider
      value={{
        socket,
        room, setRoom,
        currentRoom, setCurrentRoom,
        allUsers, setAllUsers,
        messageList, setMessageList,
        privateMessage, setPrivateMessage,
        newMessage, setNewMessage,
        onlineUsers

      }}>
      <IonApp className='main-app'>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>




              <Route exact path="/" render={() => <Home />}>

              </Route>
              <Route exact path="/room/:roomId">
                <Room />
              </Route>
              {/* <Route exact path="/test">
                <Test />
              </Route> */}
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/profile/:id">
                <Profile />
              </Route>
              <Route exact path="/user-profile/:id">
                <UserProfile />
              </Route>
              <Route exact path="/chat">
                <Chat />
              </Route>
              <Route exact path="/profile/profile-edit/:id">
                <ProfileEdit />
              </Route>
              <Route exact={true} path="/chat-list" render={() => <ChatList />}>
              </Route>

            </IonRouterOutlet>
            <IonTabBar slot='bottom'>

              <IonTabButton tab='home' href='/'
              onClick={()=>{setcurrentLocation('/')}}
              >
                {currentLocation === "/" ? <BiSolidHomeCircle size={30} /> : <BiHomeCircle size={30} />}
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab='#' href='/#' disabled>
                {location?.pathname === "/search" ? <BsSearchHeartFill size={30} color='#C2255C' /> : <BsSearchHeart size={30} color='#C2255C' />}
                <IonLabel>search</IonLabel>
              </IonTabButton>

              <IonTabButton tab='#' href='/#' disabled>
                {location?.pathname === "/request" ? <FaHandshakeSimple size={30} color='#C2255C' /> : <FaRegHandshake size={30} color='#C2255C' />}
                <IonLabel>Request</IonLabel>
              </IonTabButton>


              <IonTabButton tab='message' href='/chat-list'
              onClick={()=>{setcurrentLocation('chat-list')}}
              
              >
                {currentLocation === "chat-list" ? <HiMail size={30} color='#C2255C' /> : <HiOutlineMail size={30} color='#C2255C' />}
                <IonLabel>Message</IonLabel>
              </IonTabButton>

            </IonTabBar>

          </IonTabs>
        </IonReactRouter>
      </IonApp>

    </AppContext.Provider>
  )
};

export default App;
