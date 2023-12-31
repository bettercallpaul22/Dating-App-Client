import {
  IonButton,
  IonCol,
  IonContent,
  useIonLoading,
  IonModal,
  IonPage, IonRow,
  IonText,
  IonTextarea,
  useIonViewWillEnter,
  IonLoading,
} from '@ionic/react'
import React, { useState, useRef } from 'react'
import './UserProfile.scss'
import './UserProfile.css'
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { RequestDataResponse, User } from '../model';
import { MdMessage, MdReadMore } from 'react-icons/md';
import { FaFemale, FaUserFriends } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { BiArrowBack, BiBody } from 'react-icons/bi';
import Button from '../components/Button';
import TextField from '../components/TextField'






const UserProfile: React.FC = () => {
  const userService = new UserServices()
  const history = useHistory()
  const [friendProfile, setFriendProfile] = useState<User>()
  const [text, setText] = useState('')
  const [billName, setBillName] = useState<any>('')
  const [myProfile, setMyprofile] = useState<User>()
  // const [loading, setloading] = useState(false)


  const modal = useRef<HTMLIonModalElement>(null)
  const loadingModal = useRef<any>(null)
  const billModal = useRef<HTMLIonModalElement>(null)

  function getMe() {
    loadingModal.current?.present()
    userService.getMe()
      .then((res: User) => {
        loadingModal.current?.dismiss()
        setMyprofile(res)
      })
      .catch((error) => {
        loadingModal.current?.dismiss()
        console.log('fetch my profile res', error)
      })
  }


  function followUser() {
    loadingModal.current?.present()
    userService.followUser(friendProfile?._id as string)
      .then((user: User) => {
        setMyprofile(user)
        loadingModal.current?.dismiss()
      })
      .catch((err) => { console.log('err following friend', err) });

  }

  function handleSendRequest() {
    const data = {
      senderId: myProfile?._id,
      recipientId: friendProfile?._id,
      firstName: myProfile?.firstName,
      lastName: myProfile?.lastName,
      age: myProfile?.age,
      gender: myProfile?.gender,
      avatar: myProfile?.avatar,
      text,
      bill: billName,
      city: myProfile?.city,
      state: myProfile?.state,
      country: myProfile?._id,
    } as RequestDataResponse
    userService.createRequest(data)
      .then((res) => {
        console.log('request sent successfully', res);
      })
      .catch((error) => console.log('request create error message', error))
  }




  useIonViewWillEnter(() => {
    getMe()
    const loadedUser = history.location.state as User
    setFriendProfile(loadedUser)
    // loadingModal.current?.present()
  })



  return (
    <IonPage className='user-profile-main-container'>
      <IonLoading
        ref={loadingModal}
        message="Loading Profile..."
        // duration={3000}
        spinner="dots"

      />
      <IonContent className='user-profile-main-content'>
        <IonRow>
          <IonCol className='user-profile-avatar-container'>
            {/* <div className="main-avatar-container"> */}

            {
              friendProfile?.avatar === "" && friendProfile?.gender === 'male' ?
                <div className="avatar-container"
                  style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                >
                </div>
                :
                friendProfile?.avatar === "" && friendProfile?.gender === 'female' ?
                  <div className="avatar-container"
                    style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                  >
                  </div>
                  :

                  <div className='avatar-container' style={{ backgroundImage: `url(${friendProfile?.avatar})` }}>
                  </div>
            }
            {/* </div> */}

            <IonButton color='transparent' className='back-button'
              onClick={() => {
                history.goBack()
              }}
            >
              <BiArrowBack color='black' size={30} />
            </IonButton>
            <div className='user-details'>


              <div className="age-location-container" >
                <div className='location'>

                  {friendProfile?.firstName} {friendProfile?.lastName}
                </div>
                <div></div>
              </div>

              <div className="age-location-container" >
                <div className='location'>

                  {friendProfile?.age}y {friendProfile?.city} {friendProfile?.state}, {friendProfile?.country}
                </div>
                <div></div>
              </div>

              <div className="btn-follow-container">
                <IonButton onClick={followUser}>
                  <IonText>
                    {myProfile?.following?.includes(friendProfile?._id as string, 0) ? "Following" : "Follow"}
                  </IonText>
                </IonButton>
                <IonButton className='message-box'
              onClick={()=>history.push({pathname:'/chat', state:friendProfile})}
                >
                  <MdMessage color='white' size={30} />
                </IonButton>
              </div>



            </div>
          </IonCol>
        </IonRow>
        <IonRow className='user-info-modal-container'>
          <IonCol className='user-info-modal'>
            <div className='interest-field'>

              <div className="interest-text">
                <p>{friendProfile?.gender} Interested in female</p>
                <p><FaFemale size={20} /></p>
              </div>
              <div className="interest-text">
                <p>Height: 165cm</p>
                <p><GiBodyHeight size={20} /></p>
              </div>
              <div className="interest-text">
                <p>Just Hangout</p>
                <p><FaUserFriends size={20} /></p>
              </div>
              <div className="interest-text">
                <p>Body Type: Slim</p>
                <p><BiBody size={20} /></p>
              </div>
              <div className="interest-text">
                <p>Orientation: Straight</p>
                <p><BiBody size={20} /></p>
              </div>
              <div className="interest-text"

              >
                <p>Read About ...</p>
                <p><MdReadMore size={20} /></p>
              </div>


            </div>
            <div className="about-me">
              About Me
            </div>
            <div className="about-me-text">
              Energetic Web Designer with 3 years experience creating and maintaining functional,
              Energetic Web Designer with 3 years experience creating and maintaining functional,
              Energetic Web Designer with 3 years experience creating and maintaining functional,
              Energetic Web Designer with 3 years experience creating and maintaining functional,
              attractive

            </div>
          </IonCol>
        </IonRow>
        <IonRow className='main-tab-container'>

          <IonCol className='tab-col-box'

          >
            <Button
              className='button1'
              label='OFFER A DATE'
              onClick={() => {
                modal.current?.present()
              }}
            />
          </IonCol>


        </IonRow>
      </IonContent>


      <IonModal id="example-modal" ref={modal}  >
        {/* <IonContent> */}
        <IonRow>
          <IonCol size='12' className="who-pays-container">

            <div className="who-pays-text">
              WHO PAYS THE BILL :
            </div>
            <div className="bill">
              <p>{billName.toLocaleUpperCase()}</p>
            </div>
            <Button

              color='light'
              className='button1'
              label='Select'
              onClick={() => {
                billModal.current?.present()
              }}
            />

          </IonCol>

          <IonCol size='12'>

            <TextField
              value=''
              placeholder={`say somthing nice, if ${friendProfile?.firstName} accept your request, you will be able to have chat with ${friendProfile?.gender === 'female' ? 'her' : 'him'}`}
              onChange={(e) => {
                setText(e)
              }}
              errorText='error message'
            />
          </IonCol>

          <IonCol size='12'>
            <Button

              className=''
              label='SEND RQUEST'
              onClick={() => {
                handleSendRequest()
              }}
            />
          </IonCol>
        </IonRow>
        {/* </IonContent> */}
      </IonModal>
      <IonModal ref={billModal} id="example-modal-bill" style={{ marginBottom: 210 }}>
        <IonRow>
          <IonCol className='option-container'>
            <IonText className='option-text'
              onClick={() => setBillName(myProfile?.firstName)}
            >I {myProfile?.firstName} will pay for the bill
            </IonText>
            <IonText
              className='option-text'
              onClick={() => setBillName(friendProfile?.firstName)}
            >{friendProfile?.firstName} will pay for the bill</IonText>
            <IonText className='option-text'
              onClick={() => setBillName('Shared Bill')}


            >We will share for the bill</IonText>
          </IonCol>
        </IonRow>
      </IonModal>




    </IonPage>
  )
}

export default UserProfile