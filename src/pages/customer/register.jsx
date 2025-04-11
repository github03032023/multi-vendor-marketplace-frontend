import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosSetUp';

const UserRegister = () => {
    const formRef = useRef(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(formRef.current);
        const phone = parseInt(formData.get('phone'), 10);
        const age = parseInt(formData.get('age'), 10);
        if (isNaN(age)) {
            setError("Age must be a valid number");
            return;
        }
        if (isNaN(phone)) {
            setError("phone must be a valid number");
            return;
        }
        const data = {
            "name": formData.get('name'),
            "email": formData.get('email'),
            "password": formData.get('password'),
            "confirmPassword": formData.get('confirmPassword'),
            "phone": phone,
            "age": age,
            "gender": formData.get('gender'),
            "location": formData.get('location'),
            "role": "user"
        };

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/customer/registerCustomer', data);
            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row vh-100 align-items-center">
                <div className="col-md-6 d-none d-md-block">
                    <img src="/images/UserRegistration.png" alt="Register" className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Register</h2>
                        {error && <p className="alert alert-danger">{error}</p>}
                        <form ref={formRef} onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    minLength="3"
                                    maxLength="50"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder='Please enter in the correct email format'
                                    required
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder='Minimum Password length is 8 characters'
                                    required
                                    minLength="8"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    required
                                    minLength="8"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder='Please enter 10 digit number'
                                    required
                                    pattern="\d{10}"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-control"
                                    placeholder='Minimum age should be 18'
                                    required
                                    min="18"
                                    max="100"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Gender</label>
                                <select name="gender" className="form-control" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-control"
                                    required
                                    minLength="3"
                                    maxLength="100"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <p className="text-center mt-3">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;

