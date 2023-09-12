import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonLoading, IonPage, IonRow, IonSkeletonText, IonText, IonTextarea, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import React, { useState, useEffect, useContext, useRef } from 'react'
import './Chat.scss'
import { MdArrowBackIosNew, MdSend } from 'react-icons/md'
import { useHistory } from 'react-router'
import { call, } from 'ionicons/icons'
import { UserServices } from '../services/UserServices'
import { ConversationResponse, MessageResponse, User } from '../model'
import { AppContext } from '../appContext/context'
import { FaGift } from 'react-icons/fa6'
import moment from 'moment'
// import ReactTimeAgo from 'react-time-ago'

interface Message {
  serderId: string;
  receipientId: string;
  message: string;
}


const Chat: React.FC = () => {
  const { socket, onlineUsers } = useContext(AppContext)
  const history = useHistory()
  const userService = new UserServices()

  // const [socket, setSocket] = useState<any>(null)
  const [newMessage, setNewMessage] = useState<any>('')
  const [chat, setChat] = useState<MessageResponse[]>()
  const [myProfile, setMyProfile] = useState<User>()
  const [otherUser, setOtherUser] = useState<User>()
  const [conversationId, setConversationId] = useState('')
  const [typing, setTyping] = useState('')
  const [loading, setLoading] = useState(false)


  const loadingModal = useRef<any>(null)
  const scrollRef = useRef<HTMLIonRowElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newMessage, chat, socket])

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
    loadingModal.current?.present();
    userService.getPrivateConversation(id)
      .then((conversation: ConversationResponse) => {
        if (conversation) {
          // console.log('setting chat conversation')
          setConversationId(conversation._id)
          getMessages(conversation._id)
          loadingModal.current?.dismiss();

        } else {
          userService.createConversation(id)  // creating new conversation for first time chat
            .then((conversation: ConversationResponse) => {
              setConversationId(conversation._id)
              getMessages(conversation._id)
              // console.log('conversation created', conversation)
          loadingModal.current?.dismiss();

            })
            .catch((error) => console.log('error creating conversation', error))
          loadingModal.current?.dismiss();

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

  function onTyping() {
    if (!socket) return
    socket.emit('on-typing', { data: `${myProfile?.firstName} is typing...`, receipientId: otherUser?._id })
    socket.on('on-typing', (data: any) => {
      setTyping(data.data)
    })

  }


  function onBlur() {
    if (!socket) return
    socket.emit('stop-typing', { data: '', receipientId: otherUser?._id })

    socket.on('stop-typing', (data: any) => {
      setTyping(data.data)
    })

  }

  // send a message to a user
  function sendMessage(message: any) {
    if (!socket) return
    socket.emit('message', { data: message, receipientId: otherUser?._id })
  }

  // listen to message event from a user
  useEffect(() => {
    if (!socket) return
    socket.on('message', (data: any) => {
      if (data.data.senderId === otherUser?._id) setChat((prev: any) => [...prev, data.data])
    })


    socket.on('on-typing', (data: any) => {
      setTyping(data.data)
    })

    socket.on('stop-typing', (data: any) => {
      setTyping(data.data)
    })




    return () => {
      socket.off('message')
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





  return (
    <IonPage className='main-profile-container'>
       <IonLoading
        ref={loadingModal}
        message="Loading Chat..."
        // duration={3000}
        spinner="dots"

      />
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
            <div className='info' >
              {
                otherUser?.avatar === "" && otherUser?.gender === 'male' ?
                  <div className="profile-avater"
                    style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                  >
                    <div className={onlineUsers?.some((u: any) => u.userId === otherUser?._id) ? 'online-icon' : 'offline-icon'}></div>

                  </div>
                  :
                  otherUser?.avatar === "" && otherUser?.gender === 'female' ?
                    <div className="profile-avater"
                      style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                    >
                      <div className={onlineUsers?.some((u: any) => u.userId === otherUser?._id) ? 'online-icon' : 'offline-icon'}></div>


                    </div>
                    :
                    <div className="profile-avater" style={{ backgroundImage: `url(${otherUser?.avatar})` }}>
                      <div className={onlineUsers?.some((u: any) => u.userId === otherUser?._id) ? 'online-icon' : 'offline-icon'}></div>

                    </div>
              }
              <div className='name'>
                <p>{otherUser?.firstName}</p>
              </div>
              <div className="call-box">
                <IonIcon icon={call} size='large' />
              </div>

            </div>
          </IonCol>
        </IonRow>
      </IonHeader>


    {!loading && ( <IonContent className='profile-container-content'>
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
                    </IonText>
                  </IonCol>
                </IonRow>
              ))

            }
            <IonCol size='12' ref={scrollRef}>
              {typing && (<IonText>{typing}</IonText>)}
            </IonCol>
          </div> : <div className='start-chat-info'>Say something nice to start conversation with {otherUser?.firstName}</div>}
        </div>
      </IonContent>)}
  
      <IonRow>
        <IonCol
          className='input-container'
          size='12'>
          <IonTextarea
            placeholder='Enter text'
            autoGrow
            onBlur={onBlur}
            className='input'
            value={newMessage}
            onIonInput={(e) => {
              setNewMessage(e.target.value);
              onTyping()
         
            }}
          >

          </IonTextarea>
          <div className="send-icon"
            onClick={(e) => {
              handleSubmit(e)
            }}
          >
            {newMessage ? <MdSend size={35} color='white' /> : <FaGift size={32} color='pink' />}

          </div>

        </IonCol>
      </IonRow>

    </IonPage>
  )
}

export default Chat