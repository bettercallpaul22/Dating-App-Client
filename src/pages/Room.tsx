import {
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonRow,
    IonText
} from '@ionic/react'
import React, { useState, useEffect, useContext } from 'react'
import './Room.scss'
import ProfileHeader from '../components/ProfileHeader'
import image from '../../public/assets/images/default-bg.jpg'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useHistory } from 'react-router'
import { call, send, sendSharp, videocam } from 'ionicons/icons'
import ReactTimeAgo from 'react-time-ago'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from '../appContext/context'



const Room: React.FC = () => {
    const { socket } = useContext(AppContext)
    const [chat, setChat] = useState<any>([])
    const [message, setSentMessage] = useState('')
    const roomId = '734hud8s873g4'

    useEffect(() => {
        if (!socket) return
        socket.on("connect-to-room", (data: any) => {
            console.log('connect-to-room ressponse', data)
            setChat((prev: any) => [...prev, { message: data.message, received: true }])

        })

        socket.on("specific-room-message", (data: any) => {
            console.log('specific-room-message response', data)
            setChat((prev: any) => [...prev, { message: data.message, received: true }])

        })

    }, [socket])




    function joinRoom() {
        if (!socket) return
        socket.emit('join-room', { roomId })
        console.log('client side', roomId)
    }


    function handleSubmit(e: any) {
        e.preventDefault()
        setChat((prev: any) => [...prev, { message, received: false }])
        socket.emit('room-message', { message, roomId })
        setSentMessage('')

    }



    return (
        <IonPage className='main-room-container'>
            <IonHeader style={{ height: 60, }}>
                <IonRow>
                    <IonCol className='room-header-col'
                        onClick={() => {
                            joinRoom()
                        }}
                    >
                        <div
                            className="room-header-back-btn">
                            <IonButton className='btn' size='small' color='light'
                                onClick={() => {
                                    // history.goBack();
                                }}
                            >
                                <MdArrowBackIosNew height={60} />
                            </IonButton>
                        </div>
                        <div className='info'>
                            {/* <div className="room-avater"
                style={{ backgroundImage: `url("./assets/images/obaro.jpg")` }}
              >
              </div> */}
                            <p>{roomId}</p>
                            {/* <div className="call-box">
                <IonIcon icon={call} size='large' />
              </div> */}

                        </div>
                    </IonCol>
                </IonRow>
            </IonHeader>


            <IonContent className='profile-container-content'>
                <div style={{ marginTop: '30px' }}></div>
                {
                    chat.map((data: any, index: any) => (
                        <IonRow key={index} className={!data.received ? 'chat-container-right' : 'chat-container-left'}>
                            <IonCol className={!data.received ? 'chat-right-col' : 'chat-left-col'}>
                                <IonText className={!data.received ? 'chat-right' : 'chat-left'}>{data.message}</IonText>
                                <IonText className={!data.received ? 'date-right' : 'date-left'}>
                                    {/* date */}
                                    {/* <ReactTimeAgo date={ new Date('December 17, 1995 03:24:00')} locale="en-US"/> */}
                                </IonText>
                            </IonCol>
                        </IonRow>
                    ))
                }

            </IonContent>
            <IonRow>
                <IonCol
                    className='input-container'
                    size='12'>

                    <input
                        className='input'
                        style={{ width: '100%', height: 50, border: '2px solid gray' }}
                        value={message}
                        onChange={(e) => {
                            setSentMessage(e.target.value);
                        }}
                        placeholder='Enter text'></input>

                    {message !== "" && (<div className="send-icon"
                        onClick={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <IonIcon icon={send} size='large' color='light' />
                    </div>)}

                </IonCol>
            </IonRow>
        </IonPage>
    )
}

export default Room