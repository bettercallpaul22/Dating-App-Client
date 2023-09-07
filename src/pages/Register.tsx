import { IonButton, useIonLoading, IonCol, IonContent, IonInput, IonPage, IonRow, IonLoading, IonHeader, IonRadioGroup, IonRadio, IonSelectOption, IonSelect, IonDatetimeButton, IonModal, IonDatetime, IonText, useIonViewWillEnter, } from '@ionic/react';
import './Register.scss';
import './Register.css';
import { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { User } from '../model';



interface LocationResponse {
  address: {
    city: string;
    road: string;
    postcode: string;
    state: string;
    country: string;
    country_code: string;
  }
}

interface LocRes {
  data: LocationResponse
}

interface RegisterRes {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
}


const Register: React.FC = () => {
  const userService = new UserServices()
  const history = useHistory()
  const [passwordErrMessage, setPasswordErrMessage] = useState('');
  const [comfirmPasswordErrMessage, setComfirmPasswordErrMessage] = useState('');
  const [ageGenderErr, setAgeGenderErr] = useState(false);
  const [firstName, setfirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [comfirmPassword, setComfirmPassword] = useState('')
  const [mobile, setMobile] = useState<any>()
  const [registerErr, setRegisterErr] = useState(false);
  const [registerErrMessage, setRegisterErrMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [height, setHeight] = useState<number>(0);
  const [orientation_, setOrientation_] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [hasChildren, setHasChildren] = useState('');
  const [genderInterest, setGenderInterest] = useState('');
  const [religion, setReligion] = useState('');
  const [about, setAbout] = useState('');
  const [locationErr, setlocationErr] = useState(false)
  const [locationErrMessage, setlocationErrMessage] = useState('')
  const [errMessage, setErrorMessage] = useState('')
  const [firstNameErrMessage, setFirstNameErrorMessage] = useState('')
  const [lastNameErrMessage, setLastNameErrorMessage] = useState('')
  const [emailErr, setEmailErr] = useState(false)

  const [latitude, setLatitude] = useState('')
  const [longitude, setLongtitude] = useState('')
  const loadingModal = useRef<any>(null)



  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position: any) => {
      console.log('position: ', position)
      setLatitude(position.coords.latitude)
      setLongtitude(position.coords.longitude)

    })
  }, [])


  const getLocation = async () => {
    if (!latitude || !longitude) return
    const res = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`) as LocRes
    setCity(res.data.address.city)
    setState(res.data.address.state)
    setCountry(res.data.address.country)
  }

  useEffect(() => {
    getLocation()

  }, [latitude, longitude])




  const takePicture = async () => {
    console.log('taking picture...')
    try {
      const image: any = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      setAvatar(image.dataUrl);
      // console.log('image file',image.base64String)
    } catch (error) {
      console.error('Failed to capture image', error);
    }
  }

console.log('imageDtat',avatar)
  function validateEmail(email: string) {
    const result = email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (result === null) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
  };



  function validate() {
    if (!firstName || !lastName || !email || !password || !comfirmPassword) {
      return true
    }
    else return false
  }


  function lastNameErr(value: string) {
    if (value.length < 3) {
      setLastNameErrorMessage('Last name must be at least 3 characters length')
      return true
    }
    else {
      setLastNameErrorMessage('')
      return false
    }
  }

  function firstNameErr(value: string) {
    if (value.length < 3) {
      setFirstNameErrorMessage('First name must be at least 3 characters length')
      return true
    }
    else {
      setFirstNameErrorMessage('')
      return false
    }
  }

  function passwordErr(value: string) {
    if (value.length < 6) {
      setPasswordErrMessage('Paswword must be at least 6 characters length')
      return true
    }
    else {
      setPasswordErrMessage('')
      return false
    }
  }

  function comfirmPasswordErr(value: string) {
    if (value !== password) {
      setComfirmPasswordErrMessage('Paswword mismatch')
      return true
    }
    else {
      setComfirmPasswordErrMessage('')
      return false
    }
  }

useIonViewWillEnter(()=>{
  getLocation()

})







  const handleRegister = async () => {
    console.log('city', city)
    loadingModal.current?.present()

    if (validate()) {
      setErrorMessage('All input fields must be filled')
      return
    }

    if (city === '') {
      setlocationErr(true)
      setlocationErrMessage('No location found, please turn on location service and network data')
      return
    }
 
    // modal.current?.present()
    const userData = {
      firstName,
      lastName,
      email,
      city,
      state,
      country,
      age,
      gender,
      avatar,
      height,
      orientation_,
      ethnicity,
      bodyType,
      hasChildren,
      genderInterest,
      religion,
      about,
      password,
    } as User
    userService.register(userData)
      .then((res) => {
        console.log("Register res", res._id)
        history.push({pathname:`/profile/profile-edit/${res._id}`})
        loadingModal.current?.dismiss()
      })
      .catch((error: any) => {
    loadingModal.current?.dismiss()
        console.log('register error :', error)
        // setLoading(false)
        // setRegisterErr(true)
        setRegisterErrMessage(error.response.data)

      })
  }







  // console.log('location', city, state, country)

  return (
    <IonPage className='register-main-container'>
      <IonLoading
        ref={loadingModal}
        message="Registering..."
        duration={3000}
        spinner="dots"

      />

      <IonRow>
        <IonCol>
          <div
            className='register-image'
            style={{ backgroundImage: `url("./assets/images/dating2.avif")` }}

          >

          </div>
        </IonCol>
      </IonRow>

      <IonContent className='register-ionic-content' scrollY={true}>


        <IonRow>
          <IonCol size='12' className='register-heading-col'>
            <IonText color='primary' className='register-heading-text'>
              REGISTER TO JOIN
            </IonText>

          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size='12' >
            <Input
              type='text'
              placeholder='First name'
              className=''
              value={firstName}
              onChange={(e) => {
                setErrorMessage('')
                firstNameErr(e)
                setfirstName(e)
                setlocationErrMessage('')
                
                // validateFirstName(e.target.value)
              }}
              errorMessage=''
            />
            {firstNameErrMessage && (<IonText style={{ color: 'red' }}>{firstNameErrMessage}</IonText>)}
          </IonCol>

          <IonCol size='12' >
            <Input
              type='text'
              placeholder='Last name'
              className=''
              value={lastName}
              onChange={(e) => {
                setErrorMessage('')
                lastNameErr(e)
                setlocationErrMessage('')
                setLastName(e)
                // validateFirstName(e.target.value)
              }}
              errorMessage=''
            />
            {lastNameErrMessage && (<IonText style={{ color: 'red' }}>{lastNameErrMessage}</IonText>)}
          </IonCol>

          <IonCol size='12' >
            <Input
              type='email'
              placeholder='Email'
              className=''
              value={email}
              onChange={(e) => {
                setErrorMessage('')
                validateEmail(e)
                setlocationErrMessage('')
                setRegisterErrMessage('')

                setEmail(e)
                // validateFirstName(e.target.value)
              }}
              errorMessage=''
            />
            {emailErr && (<IonText style={{ color: 'red' }}>Must be a valid email</IonText>)}

          </IonCol>

          <IonCol size='12' >
            <Input
              type='password'
              placeholder='Password'
              className=''
              value={password}
              onChange={(e) => {
                setErrorMessage('')
                passwordErr(e)
                setPassword(e)
                setlocationErrMessage('')

                // validateFirstName(e.target.value)
              }}
              errorMessage=''
            />
            {passwordErrMessage && (<IonText style={{ color: 'red' }}>{passwordErrMessage}</IonText>)}

          </IonCol>

          <IonCol size='12' >
            <Input
              type='password'
              placeholder='Comfirm Password'
              className=''
              value={comfirmPassword}
              onChange={(e) => {
                setErrorMessage('')
                comfirmPasswordErr(e)
                setComfirmPassword(e)
                setlocationErrMessage('')

                // validateFirstName(e.target.value)
              }}
              errorMessage=''
            />
            {comfirmPasswordErrMessage && (<IonText style={{ color: 'red' }}>{comfirmPasswordErrMessage}</IonText>)}
          </IonCol>

          <IonCol>
            {errMessage && (<IonText style={{ color: 'red' }}>{errMessage}</IonText>)}
            {locationErrMessage && (<IonText style={{ color: 'red' }}>{locationErrMessage}</IonText>)}
          </IonCol>

          {/* <IonCol size='12' className="profile-picture-container">
            {avatar !== '' && (<div className="profile-picture"
              style={{ backgroundImage: `url(${avatar})` }}
            // style={{ backgroundImage: `url("./assets/images/obaro.jpg")` }}
            >
            </div>)}
            {avatar === '' && gender === '' ?
              <div className="profile-picture"
                style={{ backgroundImage: `url("./assets/images/avater-other.svg")` }}
              >
              </div>
              :
              avatar === '' && gender === 'male' ?
                <div className="profile-picture"
                  style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                >
                </div>
                :

                avatar === '' && gender === 'female' ?
                  <div className="profile-picture"
                    style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                  >
                  </div> : ''

            }
            {
              avatar === '' ?
                <Button
                  color=''
                  label='ADD IMAGE'
                  onClick={() => {
                    takePicture()

                  }}
                />

                :

                <IonButton color='danger'
                  onClick={() => setAvatar('')}
                >Remove Image</IonButton>
            }

          </IonCol> */}
          {/* <IonCol size='12'
            style={{
              display: 'flex',
              gap: 30
            }}
          >
            <IonSelect placeholder='Select Gender' aria-label='Gender'
              onIonChange={(e) => { setGender(e.detail.value) }}
            >
              <IonSelectOption value='male'>Male</IonSelectOption>
              <IonSelectOption value='female'>Female</IonSelectOption>
            </IonSelect>

            <div className="age" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <input type="number"
                placeholder='Age'
                className='input'
                value={age}
                onChange={(e) => {
                  setAge(parseInt(e.target.value));
                }}
              />
              <div style={{ marginBottom: 10 }}></div>
            </div>

          </IonCol> */}
          <IonCol size='12'>
            {registerErrMessage && (<p className='error-text'>{registerErrMessage}</p>)}

          </IonCol>




          <IonCol size='12'style={{marginTop:100}}>
            <Button
              disabled={validate()}
              color=''
              label='AGREE AND CONTINUE'
              onClick={() => {
                handleRegister()
                if (avatar !== '') {
                } else {
                }
              }}
            />

          </IonCol>
          <IonCol className='register-have-acc-box'>
            <p className='text'>Already have an account?</p>
            <p className='register'
              onClick={() => {
                history.push('/login')
              }}
            >Login</p>
          </IonCol>
        </IonRow>
      </IonContent>

    </IonPage>
  );
};

export default Register;
