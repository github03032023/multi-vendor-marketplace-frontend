import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosSetUp';
import register from '../../assets/images/RegisterNow.jpg';

const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+91', country: 'India' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+86', country: 'China' },
    { code: '+971', country: 'UAE' },
    { code: '+880', country: 'Bangladesh' }
];

const UserRegister = () => {
    const formRef = useRef(null);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [countryCode, setCountryCode] = useState('+91');
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value || value.length < 3) return 'Name must be at least 3 characters';
                break;
            case 'email':
                if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) return 'Invalid email format';
                break;
            case 'password':
                if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@_!]{8,}$/.test(value)) {
                    return 'Password must be at least 8 characters with 1 uppercase, 1 digit and one of $, @, _ or !';
                }
                break;
            case 'confirmpassword':
                if (value !== formRef.current?.password?.value) return 'Passwords do not match';
                break;
            case 'phone':
                if (!/^\d{6,15}$/.test(value)) return 'Phone must be 6–15 digits';
                break;
            case 'age':
                if (value < 18 || value > 100) return 'Age must be between 18 and 100';
                break;
            case 'postalCode':
                if (!/^\d{4,10}$/.test(value)) return 'Postal code must be 4-10 digits';
                break;
            default:
                break;
        }
        return '';
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(formRef.current);
        const phone = parseInt(formData.get('phone'), 10);
        const age = parseInt(formData.get('age'), 10);

        if (isNaN(age)) return setError("Age must be a valid number");
        if (isNaN(phone)) return setError("Phone must be a valid number");

        const data = {
            "name": formData.get('name'),
            "email": formData.get('email'),
            "password": formData.get('password'),
            "confirmpassword": formData.get('confirmpassword'),
            "phone": parseInt(countryCode.replace('+', '') + phone),
            "age":age,
            "gender": formData.get('gender'),
            "addresses": [
                {
                    "street": formData.get('street'),
                    "city": formData.get('city'),
                    "state": formData.get('state'),
                    "postalCode": formData.get('postalCode'),
                    "country": formData.get('country'),
                }
            ],
            "role": "customer"
        };

        if (data.password !== data.confirmpassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/customer/registerCustomer', data);
            console.log("data",data);
            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Error details:", error.response); 
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: '60px' }}>
            <div className="row w-100 justify-content-center align-items-stretch" style={{ maxWidth: '1200px' }}>
                {/* Left Image */}
                <div className="col-md-4 d-none d-md-flex p-0">
                    <div className="w-100 h-100">
                        <img
                            src={register}
                            alt="Register"
                            className="img-fluid w-100 h-100 rounded-start"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>

                {/* Right Form */}
                <div className="col-md-8 bg-white p-5 rounded-end shadow-lg d-flex flex-column justify-content-center">
                    <h2 className="text-center mb-4">Register</h2>
                    {error && <p className="alert alert-danger">{error}</p>}

                    <form ref={formRef} onSubmit={handleSubmit} noValidate>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="confirmpassword" className={`form-control ${errors.confirmpassword ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.confirmpassword && <div className="invalid-feedback">{errors.confirmpassword}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Country Code</label>
                                <select name="countryCode" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="form-control">
                                    {countryCodes.map((c) => (
                                        <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Phone</label>
                                <input type="tel" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Age</label>
                                <input type="number" name="age" className={`form-control ${errors.age ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Gender</label>
                                <select name="gender" className="form-control" required>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <h5 className="mt-4">Address</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Street</label>
                                <input type="text" name="street" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">City</label>
                                <input type="text" name="city" className="form-control" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">State</label>
                                <input type="text" name="state" className="form-control" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Postal Code</label>
                                <input type="text" name="postalCode" className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`} onBlur={handleBlur} required />
                                {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Country</label>
                                <input type="text" name="country" className="form-control" required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
