import { IonCol, IonPage, IonRow, IonText } from '@ionic/react'
import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../appContext/context'
import { io } from 'socket.io-client'


const Test = () => {
    const socket = io("http://localhost:5000")

    const {  onlineUsers } = useContext(AppContext)
    // const [socket, setSocket] = useState<any>(null)
    const [newMessage, setnewMessage] = useState('')

    useEffect(() => {
        if (!socket) return
        socket.on('socket-connected', (data: any) => {
            console.log('total user connected', data)
        })

        socket.on('socket-disconnected', (data: any) => {
            console.log('total user disconnected', data)
        })

        return () => {
            socket.off('total-socket-connected')
        }
    }, [])

    function handleSend() {
        console.log('send msg')
        if (!newMessage) return
        socket.emit('new-message', newMessage)
        setnewMessage('')
    }



    // useEffect(() => {
    //     // setSocket(socketServer)
    //    console.log('AAp dot',socket)
    
    //     //    return () => {
    //     //   socket.disconnect()
    //     // }
    //   }, [])



    useEffect(() => {
        if (!socket) return
        socket.on('socket-connected', (data: any) => {
            console.log('total connected', data)
        })

    }, [socket])



    useEffect(() => {
        if (!socket) return

        socket.on('new-message', (data: any) => {
            console.log('new-message from server', data)
        })
    }, [socket])




    console.log("Test user socket", socket?.id)

    return (
        <IonPage>
            <IonRow>
                <IonCol size='12'>
                    <IonText>CHAT TEST</IonText>
                </IonCol>
                <IonCol size='12'>
                    <IonText>{newMessage}</IonText>
                </IonCol>
                <IonCol >
                    <input type="text"
                        placeholder='enter message'
                        style={{ height: 50, border: '2px solid black' }}
                        onChange={(e) => {
                            setnewMessage(e.target.value)
                        }}
                    />
                    <button
                        style={{ height: 50, border: '2px solid black', backgroundColor: 'skyblue' }}
                        onClick={handleSend}
                    >ENTER</button>
                </IonCol>
            </IonRow>
        </IonPage>
    )
}

export default Test