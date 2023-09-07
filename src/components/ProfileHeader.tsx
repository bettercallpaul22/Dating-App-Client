import { IonBackButton, IonButton, IonCol, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react'
import { useHistory } from 'react-router';
import './ProfileHeader.scss'
import { MdArrowBackIosNew } from 'react-icons/md';
import image from '../../public/assets/images/default-bg.jpg'

interface HeaderProps {
    showBackButton?: boolean;
    title?: string;
    subtitle?: string;
    showBorder?: boolean;
}

const ProfileHeader: React.FC<HeaderProps> = ({ showBackButton = true, title, subtitle, showBorder }) => {
    const history = useHistory()

    return (
        // <IonHeader className='profile-header-comp-main'>
        //     <IonToolbar>
        <IonRow className='profile-header-comp-main'>
            <IonCol className='profile-header-col'
                style={{ backgroundImage: `url(${image})` }}
            >
                {showBackButton && (
                    <div
                        className="profile-header-back-btn">
                        <IonButton className='btn' size='small' color='light'
                        onClick={()=>{
                            history.goBack();
                        }}
                        >
                            <MdArrowBackIosNew height={60} />
                            {/* <p>Go Back</p> */}
                        </IonButton>
                    </div>)}

                <IonTitle className='profile-header-title1'>{title}</IonTitle>
                <div className="profile-avater">
                    <img className='avater' src="./assets/images/obaro.jpg" alt="" />
                </div>
            </IonCol>

        </IonRow>
        //     </IonToolbar>
        // </IonHeader>
    )
}

export default ProfileHeader