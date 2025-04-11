import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosSetUp';


const VendorRegister = () => {
    const formRef = useRef(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(formRef.current);
        const phone = parseInt(formData.get('phone'), 10);
        const age = parseInt(formData.get('age'), 10)

        if (isNaN(age)) {
            setError("Age must be a valid number");
            return;
        }

        if (isNaN(phone)) {
            setError("Phone must be a 10 digit number");
        }

        const data = {
            "name": formData.get('name'),
            "email": formData.get('email'),
            "password": formData.get('password'),
            "confirmPassword": formData.get('confirmPassword'),
            "gender" : formData.get('gender'),
            "age" : formData.get('age'),
            "phone": formData.get('phone'),
            "homeaddress": {
                "street": formData.get('homeStreet'),
                "city": formData.get('homeCity'),
                "state": formData.get('homeState'),
                "postalCode": formData.get('homePostalCode'),
                "country": formData.get('homeCountry')
            },
            companyDetails: {
                "companyName": formData.get('companyName'),
                "companyAddress": {
                    "street": formData.get('companyStreet'),
                    "city": formData.get('companyCity'),
                    "state": formData.get('companyState'),
                    "postalCode": formData.get('companyPostalCode'),
                    "country": formData.get('companyCountry')
                },
                companyType: formData.get('companyType')
            },
            "bankAccount": {
                "accountHolderName": formData.get('accountHolderName'),
                "accountNumber": formData.get('accountNumber'),
                "ifscCode": formData.get('ifscCode'),
                "bankName": formData.get('bankName'),
                "branchName": formData.get('branchName')
            }

        };
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post("/vendor/registerVendor", data);
            if (response.data.success) {
                navigate('/vendorLogin');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Vendor Registration failed. Please try again.');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Vendor Registration</h2>
                        {error && <p className="alert alert-danger">{error}</p>}
                        <form ref={formRef} onSubmit={handleSubmit}>
                            {/* Personal Info */}
                            <h5 className="mt-3">Personal Info</h5>
                            <hr />
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Name</label>
                                    <input name="name" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" required minLength="8" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" name="confirmPassword" className="form-control" required minLength="8" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Gender</label>
                                    <select name="gender" className="form-control" required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
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
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" name="phone" className="form-control" required pattern="\d{10}" />
                                </div>
                            </div>

                            {/* Home Address */}
                            <h5 className="mt-4">Home Address</h5>
                            <hr />
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Street</label>
                                    <input name="homeStreet" className="form-control" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">City</label>
                                    <input name="homeCity" className="form-control" />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">State</label>
                                    <input name="homeState" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Postal Code</label>
                                    <input name="homePostalCode" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Country</label>
                                    <input name="homeCountry" className="form-control" required />
                                </div>
                            </div>

                            {/* Company Details */}
                            <h5 className="mt-4">Company Details</h5>
                            <hr />
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Company Name</label>
                                    <input name="companyName" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Company Type</label>
                                    <select name="companyType" className="form-control" required>
                                        <option value="">Select</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Private Limited Company">Private Limited Company</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Street</label>
                                    <input name="companyStreet" className="form-control" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">City</label>
                                    <input name="companyCity" className="form-control" />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">State</label>
                                    <input name="companyState" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Postal Code</label>
                                    <input name="companyPostalCode" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Country</label>
                                    <input name="companyCountry" className="form-control" required />
                                </div>
                            </div>

                            {/* Bank Account Details */}
                            <h5 className="mt-4">Bank Account Details</h5>
                            <hr />
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Account Holder Name</label>
                                    <input name="accountHolderName" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Account Number</label>
                                    <input name="accountNumber" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">IFSC Code</label>
                                    <input name="ifscCode" className="form-control"  required/>
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Bank Name</label>
                                    <input name="bankName" className="form-control" required />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="form-label">Branch Name</label>
                                    <input name="branchName" className="form-control" required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success w-100 mt-3">Register as Vendor</button>
                        </form>

                        <p className="text-center mt-3">
                            Already a vendor? <Link to="/vendorLogin">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default VendorRegister;