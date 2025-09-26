import React, { useState } from "react";
import { useNavigate } from 'react-router';
import { useAuth } from '../../AuthContext';
import './Login.scss';
import Input from '../../components/Input';

const fieldsConfig = {
    username: { label: "Username", type: "text", min: 4 },
    password: { label: "Password", type: "text", min: 4 },
} as const;


export type Data = {
    [K in keyof typeof fieldsConfig]: string;
};

type Field = keyof Data;

const Login2: React.FC = () => {
    console.log('Login.tsx');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = React.useState<Data>({
        username: "stevaidis",
        password: "1234",
    });


    // create the field validity state,
    // by copying the keys of the form state,
    // and give a boolean value as an initial value based on the value of the min
    const [fieldValidity, setFieldValidity] = React.useState<Record<Field, boolean>>(() => {
        const initial: Partial<Record<Field, boolean>> = {};    // empty {} needs Partial
        (Object.keys(fieldsConfig) as Field[]).forEach((k) => { // get key
            initial[k] = fieldsConfig[k].min > 0 ? false : true;  // set value
        });
        return initial as Record<Field, boolean>;               // not empty, remove Partial
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = React.useCallback((name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleValidityChange = React.useCallback((name: string, isValid: boolean) => {
        setFieldValidity(prev => ({ ...prev, [name as Field]: isValid }));
    }, []);

    const hasInvalidField = React.useMemo(
        () => Object.values(fieldValidity).some(v => v === false),
        [fieldValidity]
    );

    const isDisabled = isSubmitting || hasInvalidField;



    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

    // redirect after a while, after showing the success message
    React.useEffect(() => {
        if (redirectCountdown === null) return;

        if (redirectCountdown <= 0) {
            navigate("/data");
            return;
        }

        const timer = setTimeout(() => {
            setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearTimeout(timer);
    }, [redirectCountdown, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            const response = await login(form.username, form.password);
            if (response.success) navigate('/data');
            if (!response.success && response.message) {
                setErrorMessage(response.message);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    return (
        <div className="login">
            <form className="form" onSubmit={handleSubmit}>
                {Object.entries(fieldsConfig).map(([name, cfg]) => (
                    <Input
                        key={name}
                        id={name}
                        label={cfg.label}
                        type={cfg.type}
                        value={form[name as keyof Data]}
                        onChange={handleChange}
                        validateMinChars={cfg.min}
                        onValidityChange={handleValidityChange}
                    />
                ))}
                <button
                    className={`button button--submit ${isDisabled ? "button--disabled" : ""}`}
                    type="submit"
                    disabled={isDisabled}
                >
                    <div className="buttonLabel">
                        {isSubmitting ? 'Login...' : 'Loggin'}
                    </div>
                </button>
                <div className="form__messages">
                    {errorMessage && <p className="form__message form__message--error">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default Login2;
