import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonRow, IonText, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import React, { useState, useEffect, useContext, useRef } from 'react'
import './Chat.scss'
import Header from '../components/Header'
import ProfileHeader from '../components/ProfileHeader'
import image from '../../public/assets/images/default-bg.jpg'
import { MdAllInbox, MdArrowBackIosNew, MdSend } from 'react-icons/md'
import { useHistory } from 'react-router'
import { call, send, sendSharp, videocam } from 'ionicons/icons'
import { io } from 'socket.io-client'
import { UserServices } from '../services/UserServices'
import { ConversationResponse, MessageResponse, User } from '../model'
import { AuthService } from '../services/AuthService'
import { AppContext } from '../appContext/context'
import { FaGift } from 'react-icons/fa6'
import moment from 'moment' 
import ReactTimeAgo from 'react-time-ago'

interface Message {
  serderId: string;
  receipientId: string;
  message: string;
}


const Chat: React.FC = () => {
  const { socket } = useContext(AppContext)
  const history = useHistory()
  const userService = new UserServices()
  const authService = new AuthService()

  // const [socket, setSocket] = useState<any>(null)
  const [newMessage, setNewMessage] = useState<any>('')
  const [chat, setChat] = useState<MessageResponse[]>()
  const [myProfile, setMyProfile] = useState<User>()
  const [otherUser, setOtherUser] = useState<User>()
  const [conversationId, setConversationId] = useState<string>('')



  const scrollRef = useRef<HTMLIonRowElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newMessage, chat])

  function getMessages(conversationId: string) {
    userService.getMessages(conversationId)
      .then((message) => {
        setChat(message)
      })
      .catch((error) => {
        console.log(error)
      })
    return newMessage
  }


  function getMe() {
    userService.getMe()
      .then((user: User) => {
        setMyProfile(user)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  function getPrivateConversation(id: string) {
    userService.getPrivateConversation(id)
      .then((conversation: ConversationResponse) => {
        if (conversation) {
          setConversationId(conversation._id)
          getMessages(conversation._id)

          // console.log('private conversation res', conversation)

        } else {
          // console.log('no conversation exist', conversation)
          userService.createConversation(id)
            .then((conversation: ConversationResponse) => {
              setConversationId(conversation._id)
              getMessages(conversation._id)


              console.log('conversation created', conversation)
            })
            .catch((error) => console.log('error creating conversation', error))
        }
      })
      .catch(() => {

      })
  }



  useIonViewWillEnter(() => {
    getMe()
    const user = history.location.state as User
    setOtherUser(user)
    getPrivateConversation(user._id)
  })


  // send a message to a user
  function sendMessage(message: any) {
    if (!socket) return
    socket.emit('sendMessage', { data: message, receipientId: otherUser?._id })
  }

  // listen to message event from a user
  useEffect(() => {
    if (!socket) return
    socket.on('getMessage', (data: any) => {
      if (data.data.senderId === otherUser?._id) setChat((prev: any) => [...prev, data.data])
    })
    return () => {
      socket.off('getMessage')
    }

  }, [socket, chat, newMessage])





  function handleSubmit(e: any) {
    e.preventDefault()
    const senderId: any = myProfile?._id
    if (!newMessage) return
    userService.creatMessage(senderId, conversationId, newMessage)
      .then((message: MessageResponse) => {
        // console.log('message created res from server',message)
        setChat((prev: any) => [...prev, message])
        sendMessage(message)

      })
      .catch((error) => {
        console.log(error)
      })
    setNewMessage('')

  }




  // console.log('chat ', chat)
  // console.log('conversation ', chat?.length)
  // console.log('otherUser ', otherUser)
  // console.log('receipientId', otherUser)
  // console.log('msg', message)
  const creationDate : Date = new Date('2023-08-14T02:23:20.318+00:00')
  return (
    <IonPage className='main-profile-container'>
      <IonHeader style={{ height: 60, }}>
        <IonRow>
          <IonCol className='chat-header-col'>
            <div
              className="chat-header-back-btn">
              <IonButton className='btn' size='small' color='light'
                onClick={() => {
                  history.goBack();
                }}
              >
                <MdArrowBackIosNew height={60} />
              </IonButton>
            </div>
            <div className='info'>
              {
                otherUser?.avatar === "" && otherUser?.gender === 'male' ? <div className="profile-avater"
                  style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                >
                </div>
                  :
                  otherUser?.avatar === "" && otherUser?.gender === 'female' ? <div className="profile-avater"
                    style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                  >
                  </div>
                    :
                    <div className="profile-avater" style={{ backgroundImage: `url(${otherUser?.avatar})` }}>

                    </div>
              }
              <p>{otherUser?.firstName}</p>
              <div className="call-box">
                <IonIcon icon={call} size='large' />
              </div>

            </div>
          </IonCol>
        </IonRow>
      </IonHeader>


      <IonContent className='profile-container-content'>
        <div style={{ marginTop: '30px' }}></div>
        <div style={{ height: '86.5%' }}>
          {chat?.length !== 0 ? <div>
            {
              chat?.map((chat) => (
                <IonRow ref={scrollRef} key={chat._id} className={chat.senderId === myProfile?._id ? 'chat-container-right' : 'chat-container-left'}

                >
                  <IonCol className={chat.senderId === myProfile?._id ? 'chat-right-col' : 'chat-left-col'}>
                    <IonText className={chat.senderId === myProfile?._id ? 'chat-right' : 'chat-left'}>{chat.text}</IonText>
                    <IonText className={chat.senderId === myProfile?._id ? 'date-right' : 'date-left'}>
                    {moment(chat.createdAt).fromNow()}
                    {/* <ReactTimeAgo date={parseInt(chat.createdAt)} locale='en-US' /> */}
                    {/* <ReactTimeAgo date={parseInt(chat.createdAt)} locale='en-US' locales={}/> */}
                    </IonText>
                  </IonCol>
                </IonRow>
              ))

            }
          </div> : <div className='start-chat-info'>Say something nice to start conversation with {otherUser?.firstName}</div>}
        </div>



      </IonContent>
      <IonRow>
        <IonCol
          className='input-container'
          size='12'>

          <input
            className='input'
            // style={{ width: '100%', height: 50, border: '2px solid gray' }}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            placeholder='Enter text'></input>
          <div className="send-icon"
            onClick={(e) => {
              handleSubmit(e)
            }}
          >
            {newMessage ? <MdSend size={35} color='white'/>:  <FaGift  size={32} color='pink'/> }
         
          </div>

        </IonCol>
      </IonRow>

    </IonPage>
  )
}

export default Chat