import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLoading,
  IonModal,
  IonPage, IonRow,
  IonText,
  IonTextarea,
  useIonViewWillEnter,
} from '@ionic/react'
import React, { useState, useRef } from 'react'
import './Profile.scss'
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { RequestDataResponse, User } from '../model';
import { MdEditNote, MdMessage, MdReadMore } from 'react-icons/md';
import { FaEdit, FaFemale, FaMale, FaUserFriends } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { BiArrowBack, BiBody, BiEdit, BiEditAlt } from 'react-icons/bi';
import Button from '../components/Button';
import TextField from '../components/TextField'
import { LiaUserEditSolid } from 'react-icons/lia';
import { AuthService } from '../services/AuthService';






const Profile: React.FC = () => {
  const authService = new AuthService()
  const userService = new UserServices()
  const history = useHistory()
  const [user, setUser] = useState<User>()
  const [text, setText] = useState('')
  const [billName, setBillName] = useState<any>('')
  const [myProfile, setMyprofile] = useState<User>()
  const [logOutErrorMessage, setLogoutErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageMount, setPageMount] = useState(false)


  const loadingModal = useRef<any>(null)
  const billModal = useRef<HTMLIonModalElement>(null)

  function getMe() {
    userService.getMe()
      .then((user: User) => {
        setMyprofile(user)
        setPageMount(true)
        loadingModal.current?.dismiss()

      })
      .catch((error) => {
        setPageMount(false)
        loadingModal.current?.dismiss()
        console.log(error)
      })
  }


  function handleLogout() {
    setLoading(true)
    userService.logOut()
      .then((res) => {
        setLoading(false)
        if (res.status) history.push('/login')
        authService.clearUser()
        console.log("logout res : ", res.status)

      })
      .catch((error) => {
        console.log('error pfrom profile', error)
        // setLogoutErrorMessage(error.response.data)
        setLoading(false)

      })
  }




  useIonViewWillEnter(() => {
    getMe()
    loadingModal.current?.present()
  })



  return (
    <IonPage className='profile-main-container'>
      <IonLoading
        ref={loadingModal}
        message="Loading Profile..."
        // duration={3000}
        spinner="dots"

      />
      <IonContent className='profile-main-content'>
        {pageMount ? (<div><IonRow >
          <IonCol className=''>
            {
              myProfile?.avatar === "" && myProfile?.gender === '' ?
                <div className="profile-avatar-container"
                  style={{ backgroundImage: `url("./assets/images/avatar-other.svg")` }}
                >
                </div>
                :
                myProfile?.avatar === "" && myProfile?.gender === 'Male' ?
                  <div className="profile-avatar-container"
                    style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                  >
                  </div>
                  :
                  myProfile?.avatar === "" && myProfile?.gender === 'Female' ?
                    <div className="profile-avatar-container"
                      style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                    >
                    </div>
                    :

                    <div className='profile-avatar-container' style={{ backgroundImage: `url(${myProfile?.avatar})` }}>
                    </div>
            }


            <IonButton color='transparent' className='profile-back-button'
              onClick={() => {
                history.goBack()
              }}
            >
              <BiArrowBack color='black' size={30} />
            </IonButton>

            <div className='profile-user-details'>
              <div className="profile-age-location-container" >
                <div className='location'>

                  {myProfile?.firstName} {myProfile?.lastName}
                </div>
                <div></div>
              </div>

              <div className="profile-age-location-container" >
                <div className='location'>

                  {myProfile?.age}y {myProfile?.city} {myProfile?.state}, {myProfile?.country}
                </div>
                <div></div>
              </div>

              <IonButton color='light' className='profile-edit-icon'
                onClick={() => {
                  history.push({ pathname: `./profile-edit/${myProfile?._id}`, state: myProfile })
                }}
              >
                <LiaUserEditSolid color='black' size={30} />
              </IonButton>


            </div>

          </IonCol>
        </IonRow>
          <IonRow className=''>
            <IonCol className='user-info-modal' >
              <div className='interest-field'>

                <div className="interest-text">
                  <p>{user?.gender} Interested in {myProfile?.genderInterest}</p>
                  <p>{myProfile?.genderInterest === 'Female' ? <FaFemale size={20} /> : <FaMale size={20} />}</p>
                </div>
                <div className="interest-text">
                  <p>Height: {myProfile?.height}cm</p>
                  <p><GiBodyHeight size={20} /></p>
                </div>
                {/* <div className="interest-text">
                <p>Just Hangout</p>
                <p><FaUserFriends size={20} /></p>
              </div> */}
                <div className="interest-text">
                  <p>Body Type: {myProfile?.bodyType}</p>
                  <p><BiBody size={20} /></p>
                </div>
                <div className="interest-text">
                  <p>Orientation: {myProfile?.orientation_}</p>
                  <p><BiBody size={20} /></p>
                </div>
                <div className="interest-text">
                  <p>Read About ...</p>
                  <p><MdReadMore size={20} /></p>
                </div>


              </div>
              <div className="about-me">
                About Me
              </div>
              <div className="about-me-text">
                {myProfile?.about}
              </div>
            </IonCol>
          </IonRow>
          <IonRow className='logout'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px'
            }}>
            <IonCol size='12' style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>
              {logOutErrorMessage &&
                (<IonText style={{ color: 'red' }}>{logOutErrorMessage}</IonText>)
              }
            </IonCol>
            <IonCol size='6'>
              <Button
                label={loading ? 'PLEASE WAIT...' : 'LOGOUT'}
                onClick={() => {
                  setLogoutErrorMessage('')
                  // localStorage.clear()
                  // history.push('/login')
                  handleLogout()
                }}
              />
            </IonCol>

          </IonRow> </div>) : <div></div>}
      </IonContent>


    </IonPage>
  )
}

export default Profile