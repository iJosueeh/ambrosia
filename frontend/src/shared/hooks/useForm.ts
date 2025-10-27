import { useState, type ChangeEvent } from 'react';
import { isEmail, isNotEmpty } from '../utils/validaciones';

type Validator = (value: string, allFields: FormFields) => string | null;

interface FormField {
    value: string;
    validators: Validator[];
}

type FormFields = Record<string, FormField>;
type Errors = Record<string, string | null>;

export const useForm = (initialState: FormFields) => {
    const [fields, setFields] = useState(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFields(prevFields => {
            const updatedFields = {
                ...prevFields,
                [name]: { ...prevFields[name], value }
            };

            // Re-validate the changed field
            const error = validateField(name, value, updatedFields);
            setErrors(prevErrors => ({ ...prevErrors, [name]: error }));

            // If password changes, re-validate confirmPassword
            if (name === 'password' && updatedFields.confirmPassword) {
                const confirmPasswordError = validateField('confirmPassword', updatedFields.confirmPassword.value, updatedFields);
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: confirmPasswordError }));
            }

            return updatedFields;
        });
    };

    const validateField = (name: string, value: string, allFields: FormFields): string | null => {
        const field = allFields[name];
        if (!field) return null;

        for (const validator of field.validators) {
            // Pass allFields to the validator if it expects it
            const error = validator(value, allFields);
            if (error) return error;
        }
        return null;
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: Errors = {};

        for (const name in fields) {
            const error = validateField(name, fields[name].value, fields);
            if (error) {
                isValid = false;
            }
            newErrors[name] = error;
        }

        setErrors(newErrors);
        return isValid;
    };
    
    const getFieldProps = (name: string) => ({
        name,
        value: fields[name]?.value || '',
        onChange: handleChange,
        error: errors[name]
    });

    return {
        fields,
        errors,
        handleChange,
        validateForm,
        getFieldProps,
    };
};

export const required = (value: string) => isNotEmpty(value) ? null : 'Este campo es requerido.';
export const emailValidator = (value: string) => isEmail(value) ? null : 'Por favor, introduce un correo válido.';
export const minLength = (min: number) => (value: string) => value.length >= min ? null : `Debe tener al menos ${min} caracteres.`;

export const hasUpperCase = (value: string) => /[A-Z]/.test(value) ? null : 'Debe contener al menos una mayúscula.';
export const hasLowerCase = (value: string) => /[a-z]/.test(value) ? null : 'Debe contener al menos una minúscula.';
export const hasNumber = (value: string) => /[0-9]/.test(value) ? null : 'Debe contener al menos un número.';
export const hasSpecialChar = (value: string) => /[^A-Za-z0-9]/.test(value) ? null : 'Debe contener al menos un caracter especial.';
