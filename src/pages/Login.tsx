import { IonCol, IonContent, IonPage, IonRow, IonLoading, IonHeader, IonText, } from '@ionic/react';
import './Login.scss';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { UserServices } from '../services/UserServices';
import { RegisterResponse } from '../model';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
  const userService = new UserServices()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const modal = useRef<any>(null)
  const [loginErrMessage, setLoginErrMessage] = useState('')

  const validateEmail = () => {
    const result = email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (result === null) {
      setEmailError(true);
      return true;
    } else {
      setEmailError(false);
      return false;
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordErr(true)
      return true;
    } else {
      setPasswordErr(false)
      return false;
    }
  }

  function validate() {
    if (password.length < 6 || !email) return true

  }


  const handleLogin = () => {
    setLoading(true);
    validateEmail()
    const passwordErr = validatePassword()
    const emailErr = validateEmail()
    if (passwordErr || emailErr) return
    userService.login(email, password)
      .then((res) => {
        console.log('login response', res)
        setLoading(false)
          history.push('/')
      })
      .catch((error) => {
        console.log('login err', error)
        setLoading(false)
        setLoginErrMessage(error.response.data.message)
      })
  }




  return (
    <IonPage className='login-main-container'>

      <IonLoading
        ref={modal}
        message="Loading..."
        duration={3000}
        spinner="circles"
      />
      <IonRow>
        <IonCol>
          <div
            className='login-image'
            style={{ backgroundImage: `url("./assets/images/dating2.avif")` }}

          >

          </div>
        </IonCol>
      </IonRow>
      <IonContent className='login-ionic-content' scrollY={false}>


        <IonRow>
          <IonCol size='12' className='login-heading-col'>
            <IonText color='primary' className='login-heading-text'>
              LOGIN
            </IonText>

          </IonCol>
        </IonRow>


        <IonRow style={{ marginTop: '30px' }}>

          <IonCol size='12'>
            <Input
              type='email'
              placeholder='Email'
              className=''
              value={email}
              onChange={(e) => {
                setEmail(e);
                setEmailError(false)
                setLoginErrMessage('')
              }}
              errorMessage={emailError ? 'Please enter a valid email' : ''}
            />
          </IonCol>

          <IonCol size='12'>
            <Input
              placeholder='Password'
              className='input'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e);
                setPasswordErr(false);
                setLoginErrMessage('')
              }}
              errorMessage={passwordErr ? 'Minimum of six characters' : ''}
            />
          </IonCol>

          <IonCol size='12' className='forget-password'>
            <IonText className='forget-password-text'>Forget Password?</IonText>
          </IonCol>

          {loginErrMessage && (<IonCol size='12'>
            <IonText style={{ fontSize: 20, color: 'red', fontWeight: 600 }}>{loginErrMessage}</IonText>
          </IonCol>)}

          <IonCol size='12'>
            <Button
              disabled={emailError || passwordErr || validate()}
              color=''
              // label='LOGIN'
              label={loading ? 'Waiting...' : 'LOGIN'}
              onClick={() => {
                handleLogin()
              }}
            />
          </IonCol>

          <IonCol className='login-have-acc-box'>
            <p className='text'>Don't have an account?</p>
            <p className='login'
              onClick={() => {
                history.push('/register')
              }}
            >Register</p>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
