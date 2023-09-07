import { useState } from 'react';
import { IonInput } from '@ionic/react';
import { TextFieldTypes } from '@ionic/core';
import './Input.scss';

interface InputProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    required?: boolean;
    small?: boolean;
    errorMessage?: string;
    type?: TextFieldTypes;
}

const Input: React.FC<InputProps> = ({
    // default value for properties
    className = '',
    placeholder = '',
    value = '',
    onChange,
    disabled = false,
    readonly = false,
    required = false,
    invalid = false,
    errorMessage,
    type = 'text',
}) => {

    // const [error, setError] = useState(false)

    function change(ev: any) {
        const val = ev.target.value || '';
        onChange(val);
        // if (val.length < 3) {
        //     setError(true)
        // } else {
        //     setError(false)
        // }
    }


        return (
            <div className={'input-div-container ' + (invalid || errorMessage || required  ? 'invalid' : '')}>
                <input
                id='input'
                    className={className}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => change(e)}
                    disabled={disabled}
                    required={required}
                    type={type}
                />
                {errorMessage ? <div className="error-message">{errorMessage}</div> : ''}
            </div>
        );
    };

    export default Input;
