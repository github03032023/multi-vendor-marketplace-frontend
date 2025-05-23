// import React, { useRef, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from '../../api/axiosSetUp';


// const VendorRegister = () => {
//     const formRef = useRef(null);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         const formData = new FormData(formRef.current);
//         const phone = parseInt(formData.get('phone'), 10);
//         const age = parseInt(formData.get('age'), 10)

//         if (isNaN(age)) {
//             setError("Age must be a valid number");
//             return;
//         }

//         if (isNaN(phone)) {
//             setError("Phone must be a valid number");
//         }

//         const data = {
//             "name": formData.get('name'),
//             "email": formData.get('email'),
//             "password": formData.get('password'),
//             "confirmpassword": formData.get('confirmpassword'),
//             "gender" : formData.get('gender'),
//             "age" : formData.get('age'),
//             "phone": formData.get('phone'),
//             "homeaddress": {
//                 "street": formData.get('homeStreet'),
//                 "city": formData.get('homeCity'),
//                 "state": formData.get('homeState'),
//                 "postalCode": formData.get('homePostalCode'),
//                 "country": formData.get('homeCountry')
//             },
//             "companyDetails": {
//                 "companyName": formData.get('companyName'),
//                 "companyAddress": {
//                     "street": formData.get('companyStreet'),
//                     "city": formData.get('companyCity'),
//                     "state": formData.get('companyState'),
//                     "postalCode": formData.get('companyPostalCode'),
//                     "country": formData.get('companyCountry')
//                 },
//                 "companyType": formData.get('companyType')
//             },
//             "bankAccount": {
//                 "accountHolderName": formData.get('accountHolderName'),
//                 "accountNumber": formData.get('accountNumber'),
//                 "ifscCode": formData.get('ifscCode'),
//                 "bankName": formData.get('bankName'),
//                 "branchName": formData.get('branchName')
//             }

//         };
//         if (data.password !== data.confirmpassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         try {
//             const response = await axios.post("/vendor/registerVendor", data);
//             console.log("Response is ",response.data);
//             if (response.data.success) {
//                 navigate('/vendorLogin');
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error details:", error.response); 
//             setError('Vendor Registration failed. Please try again.');
//         }
//     };

//     return (
//         <div className="container py-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-10 col-lg-8">
//                     <div className="card shadow-lg p-4">
//                         <h2 className="text-center mb-4">Vendor Registration</h2>
//                         {error && <p className="alert alert-danger">{error}</p>}
//                         <form ref={formRef} onSubmit={handleSubmit}>
//                             {/* Personal Info */}
//                             <h5 className="mt-3">Personal Info</h5>
//                             <hr />
//                             <div className="row">
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Name</label>
//                                     <input name="name" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Email</label>
//                                     <input type="email" name="email" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Password</label>
//                                     <input type="password" name="password" className="form-control" required minLength="8" />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Confirm Password</label>
//                                     <input type="password" name="confirmpassword" className="form-control" required minLength="8" />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Gender</label>
//                                     <select name="gender" className="form-control" required>
//                                         <option value="">Select Gender</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                         <option value="other">Other</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Age</label>
//                                     <input
//                                     type="number"
//                                     name="age"
//                                     className="form-control"
//                                     placeholder='Minimum age should be 18'
//                                     required
//                                     min="18"
//                                     max="100"
//                                 />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Phone</label>
//                                     <input type="tel" name="phone" className="form-control" required pattern="\d{10}" />
//                                 </div>
//                             </div>

//                             {/* Home Address */}
//                             <h5 className="mt-4">Home Address</h5>
//                             <hr />
//                             <div className="row">
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Street</label>
//                                     <input name="homeStreet" className="form-control" />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">City</label>
//                                     <input name="homeCity" className="form-control" />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">State</label>
//                                     <input name="homeState" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Postal Code</label>
//                                     <input name="homePostalCode" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Country</label>
//                                     <input name="homeCountry" className="form-control" required />
//                                 </div>
//                             </div>

//                             {/* Company Details */}
//                             <h5 className="mt-4">Company Details</h5>
//                             <hr />
//                             <div className="row">
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Company Name</label>
//                                     <input name="companyName" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Company Type</label>
//                                     <select name="companyType" className="form-control" required>
//                                         <option value="">Select</option>
//                                         <option value="Proprietorship">Proprietorship</option>
//                                         <option value="Partnership">Partnership</option>
//                                         <option value="LLP">LLP</option>
//                                         <option value="Private Limited Company">Private Limited Company</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Street</label>
//                                     <input name="companyStreet" className="form-control" />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">City</label>
//                                     <input name="companyCity" className="form-control" />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">State</label>
//                                     <input name="companyState" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Postal Code</label>
//                                     <input name="companyPostalCode" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Country</label>
//                                     <input name="companyCountry" className="form-control" required />
//                                 </div>
//                             </div>

//                             {/* Bank Account Details */}
//                             <h5 className="mt-4">Bank Account Details</h5>
//                             <hr />
//                             <div className="row">
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Account Holder Name</label>
//                                     <input name="accountHolderName" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Account Number</label>
//                                     <input name="accountNumber" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">IFSC Code</label>
//                                     <input name="ifscCode" className="form-control"  required/>
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Bank Name</label>
//                                     <input name="bankName" className="form-control" required />
//                                 </div>
//                                 <div className="mb-3 col-md-4">
//                                     <label className="form-label">Branch Name</label>
//                                     <input name="branchName" className="form-control" required />
//                                 </div>
//                             </div>

//                             <button type="submit" className="btn btn-success w-100 mt-3">Register as Vendor</button>
//                         </form>

//                         <p className="text-center mt-3">
//                             Already a vendor? <Link to="/vendorLogin">Login here</Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

// };

// export default VendorRegister;


import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosSetUp';

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

const VendorRegister = () => {
    const formRef = useRef(null);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [countryCode, setCountryCode] = useState('+91');
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.length < 3 ? 'Name must be at least 3 characters' : '';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email';
            case 'password':
                return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!_]{8,}$/.test(value)
                    ? ''
                    : 'Password must be 8+ chars with 1 uppercase, 1 digit, 1 special char ($@!_)';
            case 'confirmpassword':
                return value !== formRef.current.password.value ? 'Passwords do not match' : '';
            case 'phone':
                return /^\d{6,15}$/.test(value) ? '' : 'Phone must be 6-15 digits';
            case 'age':
                return value >= 18 && value <= 100 ? '' : 'Age must be between 18 and 100';
            case 'homePostalCode':
            case 'companyPostalCode':
                return /^\d{4,10}$/.test(value) ? '' : 'Postal code must be 4-10 digits';
            case 'ifscCode':
                return /[^a-zA-Z0-9]/.test(value) ? 'IFSC must not contain special chars' : '';
            default:
                return '';
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const msg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: msg }));
    };

    const validateForm = () => {
        const fields = formRef.current.elements;
        const newErrors = {};
        for (let field of fields) {
            if (field.name) {
                const error = validateField(field.name, field.value);
                if (error) newErrors[field.name] = error;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) {
            setError('Please fix the highlighted errors.');
            return;
        }

        const formData = new FormData(formRef.current);
        const fullPhone = parseInt(countryCode.replace('+', '') + formData.get('phone'), 10);

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmpassword: formData.get('confirmpassword'),
            gender: formData.get('gender'),
            age: parseInt(formData.get('age'), 10),
            phone: fullPhone,
            homeaddress: {
                street: formData.get('homeStreet'),
                city: formData.get('homeCity'),
                state: formData.get('homeState'),
                postalCode: formData.get('homePostalCode'),
                country: formData.get('homeCountry')
            },
            companyDetails: {
                companyName: formData.get('companyName'),
                companyAddress: {
                    street: formData.get('companyStreet'),
                    city: formData.get('companyCity'),
                    state: formData.get('companyState'),
                    postalCode: formData.get('companyPostalCode'),
                    country: formData.get('companyCountry')
                },
                companyType: formData.get('companyType')
            },
            bankAccount: {
                accountHolderName: formData.get('accountHolderName'),
                accountNumber: formData.get('accountNumber'),
                ifscCode: formData.get('ifscCode'),
                bankName: formData.get('bankName'),
                branchName: formData.get('branchName')
            }
        };

        try {
            const response = await axiosInstance.post("/vendor/registerVendor", data);
            if (response.data.success) {
                navigate('/vendorLogin');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            // console.error("Registration error:", err);
            // setError('Vendor Registration failed. Please try again.');
            const backendMessage = error.response?.data?.message || "Vendor Registration failed. Please try again.";
            setError(backendMessage);
        }
    };

    const renderInput = (label, name, type = "text", required = true) => (
        <div className="mb-3 col-md-6">
            <label className="form-label">{label}</label>
            <input
                type={type}
                name={name}
                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                onBlur={handleBlur}
                required={required}
            />
            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Vendor Registration</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form ref={formRef} onSubmit={handleSubmit}>
                            {/* Personal Info */}
                            <h5>Personal Info</h5><hr />
                            <div className="row">
                                {renderInput("Name", "name")}
                                {renderInput("Email", "email", "email")}
                                {renderInput("Password", "password", "password")}
                                {renderInput("Confirm Password", "confirmpassword", "password")}
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Gender</label>
                                    <select name="gender" className="form-control" required>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                {renderInput("Age", "age", "number")}

                                {/* Phone with country code */}
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select w-auto"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            style={{ maxWidth: '100px' }}
                                        >
                                            {countryCodes.map(({ code, country }) => (
                                                <option key={code} value={code}>{code}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            placeholder="Enter phone number"
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Home Address */}
                            <h5 className="mt-4">Home Address</h5><hr />
                            <div className="row">
                                {renderInput("Street", "homeStreet")}
                                {renderInput("City", "homeCity")}
                                {renderInput("State", "homeState")}
                                {renderInput("Postal Code", "homePostalCode")}
                                {renderInput("Country", "homeCountry")}
                            </div>

                            {/* Company Details */}
                            <h5 className="mt-4">Company Details</h5><hr />
                            <div className="row">
                                {renderInput("Company Name", "companyName")}
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Company Type</label>
                                    <select name="companyType" className="form-control" required>
                                        <option value="">Select</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Private Limited Company">Private Limited Company</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {renderInput("Company Street", "companyStreet")}
                                {renderInput("Company City", "companyCity")}
                                {renderInput("Company State", "companyState")}
                                {renderInput("Company Postal Code", "companyPostalCode")}
                                {renderInput("Company Country", "companyCountry")}
                            </div>

                            {/* Bank Account Details */}
                            <h5 className="mt-4">Bank Account Details</h5><hr />
                            <div className="row">
                                {renderInput("Account Holder Name", "accountHolderName")}
                                {renderInput("Account Number", "accountNumber")}
                                {renderInput("IFSC Code", "ifscCode")}
                                {renderInput("Bank Name", "bankName")}
                                {renderInput("Branch Name", "branchName")}
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Register</button>
                            <p className="text-center mt-3">Already have an account? <Link to="/vendorLogin">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;
