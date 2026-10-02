import { useState } from 'react'
import Panel from './Panel'

export default function CreateForm({ title, fields, buttonText, endpoint, onSuccess }) {

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    // const [city, setCity] = useState("delhi");

    const isValidImageUrl = (value) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?(#.*)?$/i.test(value || '');

    const validateField = (field, value) => {
        const required = field.required !== false;

        if (required && (value === undefined || value === null || String(value).trim() === '')) {
            return `${field.label} is required`;
        }

        if (field.type === 'number' && String(value).trim() !== '') {
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) {
                return `${field.label} must be a number`;
            }
            if (field.min !== undefined && numericValue < field.min) {
                return `${field.label} must be at least ${field.min}`;
            }
            if (field.max !== undefined && numericValue > field.max) {
                return `${field.label} must be at most ${field.max}`;
            }
        }

        if ((field.validation === 'imageUrl' || field.name === 'image') && String(value).trim() !== '' && !isValidImageUrl(value)) {
            return 'Please use a valid image URL';
        }

        return '';
    };

    const validateForm = () => {
        const nextErrors = {};

        fields.forEach((field) => {
            const message = validateField(field, formData[field.name]);
            if (message) {
                nextErrors[field.name] = message;
            }
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const createRecord = async () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        try {
            setSubmitError('');
            const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            // console.log('Response:', response);

            if (response.ok) {
                await response.json();
                setFormData({});
                setErrors({});
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            } else {
                const errorBody = await response.json().catch(() => ({}));
                setSubmitError(errorBody?.message || 'Failed to create record');
            }
        } catch (error) {
            setSubmitError(error.message || 'Error creating record');
        }
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field.name]: value }));

        const message = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field.name]: message }));
        if (submitError) {
            setSubmitError('');
        }
    };

    return (
        <Panel>
            <div className="card-header">
                <div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-subtitle">Static form layout for UI showcase.</p>
                </div>
                <span className="badge">Form</span>
            </div>

            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
                {/* <label>
                    <span>city</span>
                    <input
                        type="text"
                        placeholder='enter city'
                        className='border-2 border-black'
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                    />
                </label> */}



                {fields.map((field) => (
                    <label key={field.name} className={field.fullWidth ? 'span-2' : ''}>
                        <span className="field-label">{field.label}</span>
                        {field.type === 'textarea' ? (
                            <textarea
                                placeholder={field.placeholder}
                                className={`field-input ${errors[field.name] ? 'field-input-error' : ''}`}
                                value={formData[field.name] || ''}
                                onChange={(e) => updateField(field, e.target.value)}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                className={`field-input ${errors[field.name] ? 'field-input-error' : ''}`}
                                value={formData[field.name] || ''}
                                onChange={(e) => updateField(field, e.target.value)}
                            >
                                <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                {(field.options || []).map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className={`field-input ${errors[field.name] ? 'field-input-error' : ''}`}
                                value={formData[field.name] || ''}
                                onChange={(e) => updateField(field, e.target.value)}
                            />
                        )}
                        {errors[field.name] && <span className="field-error">{errors[field.name]}</span>}
                    </label>
                ))}

                {submitError && <p className="span-2 form-error">{submitError}</p>}

                <div className="span-2">
                    <button type="button" className="button-primary" onClick={createRecord}>
                        {buttonText}
                    </button>
                </div>
            </form>
        </Panel>
    )
}