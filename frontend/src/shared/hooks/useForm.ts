
import { useState, type ChangeEvent } from 'react';
import { isEmail, isNotEmpty } from '../utils/validaciones';

type Validator = (value: string) => string | null;

interface FormField {
    value: string;
    validators: Validator[];
}

type FormFields = Record<string, FormField>;
type Errors = Record<string, string | null>;

export const useForm = (initialState: FormFields) => {
    const [fields, setFields] = useState(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const validateField = (name: string, value: string): string | null => {
        const field = fields[name];
        if (!field) return null;

        for (const validator of field.validators) {
            const error = validator(value);
            if (error) return error;
        }
        return null;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], value }
        }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: Errors = {};

        for (const name in fields) {
            const error = validateField(name, fields[name].value);
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
