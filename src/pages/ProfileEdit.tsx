import {
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonLoading,
    IonPage, IonRow,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    useIonViewWillEnter,
} from '@ionic/react'
import React, { useState, useRef } from 'react'
import './ProfileEdit.scss'
import { UserServices } from '../services/UserServices';
import { RegisterResponse, User } from '../model';
import { useHistory } from 'react-router';
import { BiArrowBack } from 'react-icons/bi';
import { LiaUserEditSolid } from 'react-icons/lia';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Button from '../components/Button';









const ProfileEdit: React.FC = () => {
    const userService = new UserServices()
    const history = useHistory()
    const [myProfile, setMyprofile] = useState<User>()
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState<number>();
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState<number>();
    const [orientation_, setOrientation_] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [hasChildren, setHasChildren] = useState('');
    const [genderInterest, setGenderInterest] = useState('');
    const [religion, setReligion] = useState('');
    const [about, setAbout] = useState('');
    const [loading, setLoading] = useState(false);

    const loadingModal = useRef<any>(null)


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
    function getMe() {
        loadingModal.current?.present()
        userService.getMe()
          .then((user: User) => {
              loadingModal.current?.dismiss()
            console.log(user)
            setMyprofile(user)
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setAge(user.age)
            setHeight(user.height)
            setGender(user.gender)
            setAvatar(user.avatar)
            setGenderInterest(user.genderInterest)
            setHasChildren(user.hasChildren)
            setAbout(user.about)
            setOrientation_(user.orientation_)
            setBodyType(user.bodyType)
            setEthnicity(user.ethnicity)
            setReligion(user.religion)
           
          })
          .catch((error) => {
            loadingModal.current?.dismiss()
            console.log('fetch my profile res', error)
          })
      }

    // function getState() {
    //     const user = history.location.state as User
    //     setMyprofile(user)
    //     setFirstName(user.firstName)
    //     setLastName(user.lastName)
    //     setAge(user.age)
    //     setHeight(user.height)
    //     setGender(user.gender)
    //     setAvatar(user.avatar)
    //     setGenderInterest(user.genderInterest)
    //     setHasChildren(user.hasChildren)
    //     setAbout(user.about)
    //     setOrientation_(user.orientation_)
    //     setBodyType(user.bodyType)
    //     setEthnicity(user.ethnicity)
    //     setReligion(user.religion)
    // }


    useIonViewWillEnter(() => {
        // getState()
        getMe()

    })



    const handleUpdate = async () => {
        loadingModal.current?.present()

        setLoading(true)
        const userData = {
            firstName,
            lastName,
            gender,
            age,
            avatar,
            height,
            orientation_,
            ethnicity,
            bodyType,
            hasChildren,
            genderInterest,
            religion,
            about
        } as User
        userService.updateProfile(userData, myProfile?._id)
            .then((res) => {
            loadingModal.current?.dismiss()

                console.log("Update successfull", res)
                setLoading(false);
            })
            .catch((error: any) => {
            loadingModal.current?.dismiss()

                console.log('Profile update error :', error.response.data)
                setLoading(false);
            })
    }


    console.log('state', history.location.state)


    return (
        <IonPage className='profile-edit-main-container'>
             <IonLoading
        ref={loadingModal}
        message="Updating Profile..."
        duration={3000}
        spinner="dots"

      />
            <IonHeader>
                <IonRow >
                    <IonCol className='profile-edit-header-col' >
                        <div className="profile-edit-local-text">EDIT PROFILE</div>

                    </IonCol>
                </IonRow>
            </IonHeader>
            <IonButton color='transparent' className='profile-back-button'
                onClick={() => {
                    history.goBack()
                }}
            >
                <BiArrowBack color='black' size={30} />
            </IonButton>
            <IonContent className='profile-edit-main-content'>
                <IonRow style={{ marginTop: 20 }}>
                    <IonCol className='avatar-container'
                        onClick={() => takePicture()}
                    >
                        {avatar && (<div className="avatar"
                            style={{ backgroundImage: `url(${avatar})` }}
                        >
                            <IonButton color='transparent' className='edit-avatar-icon'
                                onClick={() => {
                                    // history.goBack()
                                }}
                            >
                                <LiaUserEditSolid color='black' size={40} />
                            </IonButton>
                        </div>)}

                        {avatar === '' &&
                            (myProfile?.avatar === "" && myProfile?.gender === '' ?
                                <div className="avatar"
                                    style={{ backgroundImage: `url("./assets/images/avatar-other.svg")` }}
                                >
                                    <IonButton color='transparent' className='edit-avatar-icon'
                                        onClick={() => {
                                            // history.goBack()
                                        }}
                                    >
                                        <LiaUserEditSolid color='black' size={40} />
                                    </IonButton>
                                </div>
                                :
                                myProfile?.avatar === "" && myProfile?.gender === 'Male' ?
                                    <div className="avatar"
                                        style={{ backgroundImage: `url("./assets/images/avatar-male.svg")` }}
                                    >
                                        <IonButton color='transparent' className='edit-avatar-icon'
                                            onClick={() => {
                                                // history.goBack()
                                            }}
                                        >
                                            <LiaUserEditSolid color='black' size={40} />
                                        </IonButton>
                                    </div>
                                    :
                                    myProfile?.avatar === "" && myProfile?.gender === 'Female' ?
                                        <div className="avatar"
                                            style={{ backgroundImage: `url("./assets/images/avatar-female.svg")` }}
                                        >
                                            <IonButton color='transparent' className='edit-avatar-icon'
                                                onClick={() => {
                                                    // history.goBack()
                                                }}
                                            >
                                                <LiaUserEditSolid color='black' size={40} />
                                            </IonButton>
                                        </div>
                                        :

                                        <div className='avatar' style={{ backgroundImage: `url(${myProfile?.avatar})` }}>
                                            <IonButton color='transparent' className='edit-avatar-icon'
                                                onClick={() => {
                                                    // history.goBack()
                                                }}
                                            >
                                                <LiaUserEditSolid color='black' size={40} />
                                            </IonButton>
                                        </div>)
                        }

                    </IonCol>

                    <IonCol size='12' className='edit-profile-text-container'>
                        <IonInput
                            // label='First Name'
                            value={firstName}
                            placeholder='First Name'
                            // labelPlacement='stacked'
                            clearInput
                            maxlength={30}
                            // label='Firstname'
                            onIonInput={(e: any) => setFirstName(e.detail.value)}
                        >
                        </IonInput>
                    </IonCol>
                    <IonCol size='12' className='edit-profile-text-container'>
                        <IonInput
                            value={lastName}
                            placeholder='Last Name'
                            // labelPlacement='stacked'
                            clearInput
                            maxlength={30}
                            // label='Lastname'
                            onIonInput={(e: any) => setLastName(e.detail.value)}
                        >
                        </IonInput>
                    </IonCol>
                    <IonCol size='12' className='edit-profile-text-container other-style'>
                        <IonSelect label='Gender' placeholder='choose Gender'
                            onIonChange={(e) => { setGender(e.detail.value) }}
                        >
                            <IonSelectOption value='Male'>Male</IonSelectOption>
                            <IonSelectOption value='Female' >Female</IonSelectOption>
                            <IonSelectOption value='Others' >Others</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonInput
                            type='number'
                            value={age}
                            placeholder='Age'
                            labelPlacement='stacked'
                            max={100}
                            label='Age'
                            onIonInput={(e: any) => setAge(e.detail.value)}
                        >
                        </IonInput>
                    </IonCol>
                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonInput
                            type='number'
                            value={height}
                            placeholder='Enter height 00cm'
                            labelPlacement='stacked'
                            clearInput
                            maxlength={5}
                            label='Height'
                            onIonInput={(e: any) => setHeight(e.detail.value)}
                        >
                        </IonInput>
                    </IonCol>

                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonSelect label='Orientation' placeholder='choose Orientation'
                            onIonChange={(e) => { setOrientation_(e.detail.value) }}
                        >
                            <IonSelectOption value='Straight' >Straight</IonSelectOption>
                            <IonSelectOption value='BiSexual' >BiSexual</IonSelectOption>
                            <IonSelectOption value='Others' >Others</IonSelectOption>
                        </IonSelect>
                    </IonCol>

                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonSelect label='Body Type' placeholder='choose BodyType'
                            onIonChange={(e) => setBodyType(e.detail.value)}
                        >
                            <IonSelectOption value='Slender' >Slender</IonSelectOption>
                            <IonSelectOption value='Athletic' >Athletic</IonSelectOption>
                            <IonSelectOption value='A few extra pounds' >A few extra pounds</IonSelectOption>
                            <IonSelectOption value='Stocky' >Stocky</IonSelectOption>
                            <IonSelectOption value='Blank' >Blank</IonSelectOption>
                        </IonSelect>
                    </IonCol>

                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonSelect label='Ethnicity' placeholder='Choose Ethnicity'
                            onIonChange={(e) => setEthnicity(e.detail.value)}
                        >
                            <IonSelectOption value='Black' >Black</IonSelectOption>
                            <IonSelectOption value='White/Caucasian' >White/Caucasian</IonSelectOption>
                            <IonSelectOption value='Asian' >Asian</IonSelectOption>
                            <IonSelectOption value='Native American' >Native American</IonSelectOption>
                            <IonSelectOption value='Middle Eastern' >Middle Eastern</IonSelectOption>
                            <IonSelectOption value='Latino/Hispanic' >Latino/Hispanic</IonSelectOption>
                            <IonSelectOption value='Others' >Others</IonSelectOption>
                        </IonSelect>
                    </IonCol>

                    <IonCol size='6' className='edit-profile-text-container other-style'>
                        <IonSelect label='Religion' placeholder='Choose Religion'
                            onIonChange={(e) => setReligion(e.detail.value)}
                        >
                            <IonSelectOption value='Christain' >Christain</IonSelectOption>
                            <IonSelectOption value='Muslim' >Muslim</IonSelectOption>
                            <IonSelectOption value='Jewish' >Jewish</IonSelectOption>
                            <IonSelectOption value='Athiest' >Athiest</IonSelectOption>
                            <IonSelectOption value='Hindu' >Hindu</IonSelectOption>
                            <IonSelectOption value='Others' >Others</IonSelectOption>
                        </IonSelect>
                    </IonCol>

                    <IonCol size='12' className='edit-profile-text-container other-style'>
                        <IonSelect label='Has Children' placeholder='Choose Options'
                            onIonChange={(e) => setHasChildren(e.detail.value)}
                        >
                            <IonSelectOption value='Yes and they live with me' >Yes and they live with me</IonSelectOption>
                            <IonSelectOption value='Muslim' >Yes and they live elsewhere</IonSelectOption>
                            <IonSelectOption value='No' >No</IonSelectOption>
                            <IonSelectOption value='Blank' >Blank</IonSelectOption>
                        </IonSelect>
                    </IonCol>


                    <IonCol size='12' className='edit-profile-text-container other-style' >
                        <IonSelect label={`${myProfile?.gender} Interested In`} placeholder='choose interest'
                            onIonChange={(e) => setGenderInterest(e.detail.value)}
                        >
                            <IonSelectOption value='Male' >Male</IonSelectOption>
                            <IonSelectOption value='Female' >Female</IonSelectOption>
                            <IonSelectOption value='Anyone' >Anyone</IonSelectOption>
                        </IonSelect>
                    </IonCol>

                    <IonCol size='12' className='edit-profile-text-container'>
                        <IonTextarea
                            value={about}
                            placeholder='About'
                            labelPlacement='stacked'
                            maxlength={300}
                            autoGrow
                            label='About'
                            onIonInput={(e: any) => setAbout(e.detail.value)}

                        >
                        </IonTextarea>
                    </IonCol>

                    <IonCol>
                        <Button
                            label={loading ? 'PLEASE WAIT...': 'UPDATE PROFILE'}
                            onClick={() => {
                                handleUpdate()
                            }}
                        />
                    </IonCol>
                </IonRow>
            </IonContent>


        </IonPage>
    )
}

export default ProfileEdit