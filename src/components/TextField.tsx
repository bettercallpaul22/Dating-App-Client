import React from 'react'
import './TextField.scss'
import { IonTextarea } from '@ionic/react'

interface TextareaChangeEventDetails {
    value: string | null;
}

interface TextAreaProps {
    value: string;
    placeholder?: string;
    errorText?: string;
    autoGrow?: boolean;
    autofocus?: boolean;
    fill?: boolean;
    maxlength?: number;
    onChange: (event: any) => void;

}


const TextField: React.FC<TextAreaProps> = ({
    value,
    placeholder,
    errorText,
    autoGrow = true,
    autofocus,
    fill,
    maxlength,
    onChange
}) => {




    return (
        <div className='textarea-box'>
            <IonTextarea
            className='textarea'
                placeholder={placeholder}
                onIonInput={(e) => onChange(e.detail.value)}
                
            >

            </IonTextarea>
        </div>
    )
}

export default TextField