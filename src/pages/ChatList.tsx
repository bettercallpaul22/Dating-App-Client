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


const ChatList: React.FC = () => {
    const userService = new UserServices()
    const history = useHistory()

    // const { socket, members } = useContext(AppContext)
    const [myProfile, setMyProfile] = useState<User>()
    const [userChat, setUserChat] = useState<MyChatResponse[]>()




    function getChat(userId: string) {
        userService.getConversation(userId)
            .then((conversation: any) => {
                const friendsId = conversation.map((data: any) => data.members.find((id: string) => id !== userId))
                console.log(friendsId)
                userService.getProfile(friendsId)
                    .then((user) => {
                        setUserChat(user)
                    })
                    .catch((error) => console.log('error getting firends profile', error))
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



    console.log('chat page and chat members', userChat)
    console.log('my profile', myProfile)

    return (
        <IonPage className='chat-list-main-container'>
            <IonHeader style={{ height: 60, }}>
                <IonRow>
                    <IonCol className='chat-list-header-col'>
                        <div className="chat-list-header-back-btn">
                            Chat
                        </div>

                        <div className="profile-avater"
                            style={{ backgroundImage: `url("./assets/images/obaro.jpg")` }}
                        >
                        </div>
                    </IonCol>
                </IonRow>
            </IonHeader>

            <IonContent className='chat-list-container-content'>
                <IonRow>
                    <IonCol>
                        <div style={{ color: 'gray', marginTop: 10 }}>MY CHATS</div>
                    </IonCol>
                </IonRow>
                <IonRow>
                    {
                        userChat?.map((user: any, index: any) => (
                            <IonCol key={user._id} size='12'
                            onClick={() => {
                                // getChat('64cacbc82ce4bf93cf473f80')
                                console.log('getting chat', user._id)
                                history.push({pathname:`/chat`, state:user})
            
                              }}
                            >
                                <div className="chat-container">
                                    <div className="chat-avater"
                                        style={{ backgroundImage: `url("./assets/images/obaro.jpg")` }}
                                    ></div>
                                    <div className="info">
                                        <div className="name">{user.firstName}</div>
                                        <div className="last-message">Hi how about it</div>
                                    </div>
                                    <div className="last-chat">20hr</div>
                                </div>
                            </IonCol>
                        ))
                    }

                </IonRow>


            </IonContent>

        </IonPage>
    )
}

export default ChatList