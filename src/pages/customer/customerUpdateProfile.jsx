
import React, { useState, useEffect, useContext } from "react";
import axiosInstance from '../../api/axiosSetUp';
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { UserContext } from '../../context/userContext';
const CustomerProfileUpdate = () => {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        confirmpassword: "",
        addresses: [
            {
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: ""
            }
        ]
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { userId } = useContext(UserContext);
    console.log("userId-", userId);

    // Optionally fetch existing data
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                if (userId) {
                    const res = await axiosInstance.get(`/customer/getCustomerDetailsById/${userId}`);
                    if (res.data) {
                        setFormData(prev => ({
                            ...prev,
                            phone: res.data.phone || "",
                            addresses: res.data.addresses || [{}]
                        }));
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCustomerData();
    }, [userId]);

    const handleChange = (e, index, isAddress = false) => {
        if (isAddress) {
            const updatedAddresses = [...formData.addresses];
            updatedAddresses[index][e.target.name] = e.target.value;
            setFormData({ ...formData, addresses: updatedAddresses });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
      
        // if (!formData.phone?.trim()) {
        //   setError("Phone number is required.");
        //   return;
        // }

        if (!String(formData.phone || "").trim()) {
            setError("Phone number is required.");
            return;
        }
      
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(formData.phone)) {
          setError("Phone number must be numeric and between 10 to 15 digits.");
          return;
        }
      
        const firstAddress = formData.addresses?.[0] || {};
        if (!firstAddress.state?.trim() || !firstAddress.country?.trim() || !firstAddress.postalCode?.trim()) {
          setError("State, Country and Postal Code are required.");
          return;
        }
      
        const postalCodeRegex = /^\d{4,10}$/;
        for (const addr of formData.addresses) {
          if (!addr.postalCode || !postalCodeRegex.test(addr.postalCode)) {
            setError("Postal code must be numeric and between 4 to 10 digits.");
            return;
          }
        }
      
        const isUpdatingPassword = formData.password?.trim() || formData.confirmpassword?.trim();
        if (isUpdatingPassword) {
          if (!formData.password?.trim() || !formData.confirmpassword?.trim()) {
            setError("Both password and confirm password are required.");
            return;
          }
      
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@_!])[A-Za-z\d$@_!]{8,}$/;
          if (!passwordRegex.test(formData.password)) {
            setError("Password must be at least 8 characters with 1 uppercase, 1 digit and one of $, @, _ or !");
            return;
          }
      
          if (formData.password !== formData.confirmpassword) {
            setError("Passwords do not match.");
            return;
          }
        }
      
        try {
          const response = await axiosInstance.put(`/customer/updateCustomer/${userId}`, formData);
          setMessage(response.data.message);
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.error || "Update failed.");
        }
      };

    return (
        <Container className="my-5">
            <Card className="p-4 shadow">
                <h3 className="mb-4 text-center">Update Profile</h3>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter new phone"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="New password"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                        />
                    </Form.Group>

                    <h5 className="mt-4">Addresses</h5>
                    {formData.addresses.map((address, index) => (
                        <Row key={index} className="mb-3">
                            {["street", "city", "state", "postalCode", "country"].map((field) => (
                                <Col md={6} className="mb-2" key={field}>
                                    <Form.Control
                                        type="text"
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        name={field}
                                        value={formData.addresses[index][field]}
                                        onChange={(e) => handleChange(e, index, true)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ))}


                    <div className="d-grid">
                        <Button type="submit" variant="primary">
                            Update Profile
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default CustomerProfileUpdate;
