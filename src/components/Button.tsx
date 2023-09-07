import { IonButton, IonInput } from '@ionic/react';
import './Button.scss';

interface ButtonProps {
    className?: string;
    label: string;
    color?: string;
    disabled?: boolean;
    onClick: (ev: any) => void

}

const Button: React.FC<ButtonProps> = ({
    // default value for properties
    className = '',
    label = '',
    color = 'primary',
    disabled = false,
    onClick
}) => {

    // const [error, setError] = useState(false)




    return (
        <div className={'btn-div-conatainer '} >
            <IonButton className={className}
                disabled={disabled}
                color={color}
                onClick={e => onClick(e)}
            >
                {label}
            </IonButton>
        </div>
    );
};

export default Button;
