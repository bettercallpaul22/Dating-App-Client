import { IonBackButton, IonButton, IonCol, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react'
import { useHistory } from 'react-router';
import './Header.scss'
import { MdArrowBackIosNew } from 'react-icons/md';

interface HeaderProps {
    showBackButton?: boolean;
    title: string;
    subtitle?: string;
    showBorder?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = true, title, subtitle, showBorder }) => {
    const history = useHistory()

    return (
        <IonHeader className='header-comp-main'>
            <IonToolbar>
                <IonRow>
                    <IonCol className='header-col'>
                        { showBackButton &&(<div className="header-back-btn">
                            <IonButton className='btn' size='small' color='light'>
                                <MdArrowBackIosNew /> 
                            <p>Go Back</p>
                                </IonButton>
                        </div>)}

                        <IonTitle className='header-title1'>{title}</IonTitle>
                    </IonCol>
                </IonRow>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header