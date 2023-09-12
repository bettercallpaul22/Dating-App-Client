import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useContext, useState } from 'react'
import './ChatList.scss'
import Header from '../components/Header'
import ProfileHeader from '../components/ProfileHeader'
import image from '../../public/assets/images/default-bg.jpg'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useHistory } from 'react-router'
import { call, videocam } from 'ionicons/icons'
import { MyChatResponse, User } from '../model'
import { AppContext } from '../appContext/context'
import { UserServices } from '../services/UserServices'
import { BiArrowBack } from 'react-icons/bi'
import { HiHome, HiMail, HiOutlineHome, HiOutlineMail } from 'react-icons/hi';
import { FaHandshakeSimple } from 'react-icons/fa6';
import { AuthService } from '../services/AuthService';
import { BiHomeCircle, BiSolidHomeCircle } from 'react-icons/bi';
import { BsSearchHeartFill, BsSearchHeart } from 'react-icons/bs';
import { FaRegHandshake } from 'react-icons/fa';
import { GiSettingsKnobs } from 'react-icons/gi';



const ChatList: React.FC = () => {
    const userService = new UserServices()
    const history = useHistory()

    // const { socket, members } = useContext(AppContext)
    const [myProfile, setMyProfile] = useState<User>()
    const [userChat, setUserChat] = useState<MyChatResponse[]>()
    const [conversationList, setConversationList] = useState<any>([])




    function getChat(userId: string) {
        userService.getConversation()
            .then((conversation: any) => {

                // console.log('user conversation list', conversation.map((c:any)=>c._id))
                // console.log('user conversation list', conversation)
                setConversationList(conversation)
                // const friendsId = conversation.map((data: any) => data.members.find((id: string) => id !== userId))
                // console.log(friendsId)
                // userService.getProfile(friendsId)
                //     .then((user) => {
                //         setUserChat(user)
                //     })
                //     .catch((error) => console.log('error getting firends profile', error))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getMe() {
        userService.getMe()
            .then((user: User) => {
                setMyProfile(user)
                if (user._id) {
                    getChat(user._id)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }





    // socket.off('connection').on('connection', (users: User) => {
    //     console.log('response from server io', users)
    // })

    useIonViewWillEnter(() => {
        getMe()
        // getProfile()

    })



    // console.log('chat page and chat members', userChat?.map())
    // console.log('conversation', conversationList?.friend)
    // console.log('conversation', conversationList?.map((con: any) => con.friend))

    return (
        <IonPage className='chat-list-main-container'>
            <IonHeader>
                <IonRow >
                    <IonCol className='chat-edit-header-col' >
                        <div className="chat-edit-local-text">CHAT</div>

                    </IonCol>
                </IonRow>
            </IonHeader>
            <IonButton color='transparent' className='chat-back-button'
                onClick={() => {
                    history.goBack()
                }}
            >
                <BiArrowBack color='black' size={30} />
            </IonButton>

            <IonContent className='chat-list-container-content'>
                <IonRow>
                    <IonCol>
                        <div style={{ color: 'gray', marginTop: 10 }}>MY CHATS</div>
                    </IonCol>
                </IonRow>
                <IonRow>
                    {
                        conversationList?.map((conversation: any, index: any) => (
                            <IonCol key={conversation._id} size='12'
                                onClick={() => {
                                    // getChat('64cacbc82ce4bf93cf473f80')
                                    console.log('frnd', conversation.friend)
                                    history.push({ pathname: '/chat', state: conversation.friend })


                                }}
                            >
                                <div className="chat-container">
                                    <div className="chat-avater"
                                        style={{ backgroundImage: `url(${conversation.friend.avatar})` }}
                                    ></div>
                                    <div className="info">
                                        <div className="name">{conversation.friend.firstName}</div>
                                        <div className="last-message">Hi how about it</div>
                                    </div>
                                    <div className="last-chat">20hr</div>
                                </div>
                            </IonCol>
                        ))
                    }

                </IonRow>


            </IonContent>
         
                {/* <IonRow className='main-tab-container'>
                    <IonCol className='tab-col-box'
                        onClick={() => {
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
                            history.push("/chat-list")
                        }}
                    >
                        {history.location.pathname === "/chat-list" ? <HiMail size={30} /> : <HiOutlineMail size={30} />}
                        <p className='col-text'>Message</p>
                    </IonCol>

                </IonRow> */}
        </IonPage>
    )
}

export default ChatList