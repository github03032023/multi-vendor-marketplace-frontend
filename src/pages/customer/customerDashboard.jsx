// import React, { useState } from 'react';
// import axiosInstance from '../../api/axiosSetUp';
// import { Button, Card, Table, Modal, Form, Alert } from 'react-bootstrap';
// import { parseISO, differenceInDays, format } from 'date-fns';
// import { Link } from 'react-router-dom';
// import { toast } from 'sonner';

// const CustomerDashboard = () => {
//     const [orderId, setOrderId] = useState('');
//     const [order, setOrder] = useState(null);
//     const [errorMsg, setErrorMsg] = useState('');
//     const [errorModal, setErrorModal] = useState(false);
//     const [returnModal, setReturnModal] = useState(false);
//     const [selectedSubOrder, setSelectedSubOrder] = useState(null);
//     const [returnReason, setReturnReason] = useState('');
//     const [customMessage, setCustomMessage] = useState('');
//     const userId = localStorage.getItem("userId");

//     const fetchOrderById = async () => {
//         try {
//             const res = await axiosInstance.get(`/returnRequest/orders?keyword=${orderId}`);
//             setOrder(res.data.orders[0]);
//             setErrorMsg('');
//         } catch (error) {
//             const message = error.response?.data?.message || 'Order not found or an error occurred.';
//             setOrder(null);
//             setErrorMsg(message);
//             setErrorModal(true);
//             toast.error(message);
//         }
//     };

//     const isEligibleForReturn = (subOrder) => {
//         const status = subOrder.status;

//         if (status === 'Paid') return true;

//         if (status === 'Delivered' && subOrder.deliveredAt) {
//             const deliveredDate = parseISO(subOrder.deliveredAt);
//             return differenceInDays(new Date(), deliveredDate) <= 5;
//         }

//         return false;
//     };

//     const openReturnModal = (orderId, subOrderId) => {
//         setSelectedSubOrder({ orderId, subOrderId });
//         setReturnModal(true);
//     };

//     const handleReturn = async () => {
//         try {
//             await axiosInstance.post('/returnRequest/orders/return', {
//                 orderId: selectedSubOrder.orderId,
//                 subOrderId: selectedSubOrder.subOrderId,
//                 reason: returnReason,
//                 message: returnReason === 'Other' ? customMessage : '',
//             });

//             // 2. Find vendorId of selected suborder
//             const subOrder = order.subOrders.find(sub => sub._id === selectedSubOrder.subOrderId);
//             const vendorId = subOrder?.vendorId?._id;

//             // 3. Create vendor notification
//             if (vendorId) {
//                 try {
//                 await axiosInstance.post('/notifications/createNotificationsForVendor', {
//                     type: 'Return Request',
//                     message: `Customer has requested a return for SubOrder ${selectedSubOrder.subOrderId}`,
//                     vendorId,
//                 });
//             }catch(error){

//             }
//             }

//             setReturnModal(false);
//             setReturnReason('');
//             setCustomMessage('');
//             fetchOrderById();
//             toast.success('Return Request raised. Pending approval from vendor to process the payment.');
//             alert('Return Request raised. Pending approval from vendor to process the payment.');
//         } catch (error) {
//             console.error('Return request failed', error);
//             alert(error.response?.data?.error || 'Unable to return the goods');
//         }
//     };

//     const handleCancel = async (orderId, subOrderId, vendorId) => {
//         try {
//             await axiosInstance.patch('/order/suborder/status', {
//                 orderId,
//                 vendorId,
//                 status: 'Cancelled',
//                 updatedBy: userId, // or use actual userId if available
//             });
//             fetchOrderById(); // Refresh the UI
//             toast.success('Cancelled the order.');
//             alert('Cancelled the order.');
//         } catch (error) {
//             console.error('Cancellation failed:', error);
//             alert(error.response?.data?.error || 'Unable to cancel the order');
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <h4 className="mb-3">Search Order</h4>
//             <Form className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 mb-4">
//                 <Form.Control
//                     placeholder="Enter Order ID"
//                     value={orderId}
//                     onChange={(e) => setOrderId(e.target.value)}
//                     style={{ minWidth: '250px' }}
//                 />
//                 <Button onClick={fetchOrderById}>Search</Button>
//             </Form>

//             {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

//             {/* Modal alert */}
//             <Modal show={errorModal} onHide={() => setErrorModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Error</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>{errorMsg}</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setErrorModal(false)}>Close</Button>
//                 </Modal.Footer>
//             </Modal>

//             {order && (
//                 <Card>
//                     <Card.Header>Order ID: {order._id}</Card.Header>
//                     <Card.Body>
//                         <h6>Ordered On: {format(new Date(order.createdAt), 'dd MMM yyyy')}</h6>
//                         <h6>Total Amount: ₹{order.totalAmount.toFixed(2)}</h6>
//                         <h6>Shipping Address:</h6>
//                         <p>
//                             {order.shippingAddress.street}, {order.shippingAddress.city},<br />
//                             {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
//                         </p>

//                         <Table responsive bordered hover>
//                             <thead>
//                                 <tr>
//                                     <th>Sub Order ID</th>
//                                     <th>Product(s)</th>
//                                     <th>Quantity</th>
//                                     <th>Price (₹)</th>
//                                     <th>Vendor</th>
//                                     <th>Status</th>
//                                     <th>SubTotal</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {order.subOrders.map((sub) => (
//                                     <tr key={sub._id}>
//                                         <td>{sub._id}</td>
//                                         <td>
//                                             {sub.products.map((p) => (
//                                                 <div key={p.productId._id}>
//                                                     <Link to={`/product/${p.productId.productCode}`}>
//                                                         {p.productId.productName}
//                                                     </Link>
//                                                 </div>
//                                             ))}
//                                         </td>
//                                         <td>{sub.products.map((p) => p.quantity).join(', ')}</td>
//                                         <td>{sub.products.map((p) => `₹${p.priceAtPurchase}`).join(', ')}</td>
//                                         <td>{sub.vendorId?.name || 'N/A'}</td>
//                                         <td>{sub.status}</td>
//                                         <td>₹{sub.subTotal.toFixed(2)}</td>
//                                         <td>
//                                             {isEligibleForReturn(sub) ? (
//                                                 <Button
//                                                     size="sm"
//                                                     variant="warning"
//                                                     onClick={() => openReturnModal(order._id, sub._id)}
//                                                     className="mb-2"
//                                                 >
//                                                     Return Goods
//                                                 </Button>
//                                             ) : (
//                                                 <span className="text-muted d-block mb-2"></span>
//                                             )}

//                                             {sub.status === 'Paid' && (
//                                                 <Button
//                                                     size="sm"
//                                                     variant="danger"
//                                                     onClick={() => handleCancel(order._id, sub._id, sub.vendorId._id)}
//                                                 >
//                                                     Cancel Order
//                                                 </Button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     </Card.Body>
//                 </Card>
//             )}

//             <Modal show={returnModal} onHide={() => setReturnModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Return Sub-Order</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form.Group>
//                         <Form.Label>Reason for Return</Form.Label>
//                         <Form.Control
//                             as="select"
//                             value={returnReason}
//                             onChange={(e) => setReturnReason(e.target.value)}
//                             placeholder="Please select a reason"
//                         >
//                             <option value="">Select a reason</option>
//                             <option value="Damaged item">Damaged item</option>
//                             <option value="Wrong size">Wrong size</option>
//                             <option value="Packaging issue">Packaging issue</option>
//                             <option value="Other">Other</option>
//                         </Form.Control>
//                     </Form.Group>

//                     {returnReason === 'Other' && (
//                         <Form.Group className="mt-3">
//                             <Form.Label>Additional Details</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 value={customMessage}
//                                 onChange={(e) => setCustomMessage(e.target.value)}
//                                 placeholder="Please provide more details"
//                             />
//                         </Form.Group>
//                     )}

//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setReturnModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button variant="primary" onClick={handleReturn}>
//                         Submit Return
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default CustomerDashboard;

import React, { useState,  useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import { Button, Card, Table, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { parseISO, differenceInDays, format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from '../../components/Notifications/notification';

const CustomerDashboard = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [selectedSubOrder, setSelectedSubOrder] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const userId = localStorage.getItem("userId");

    const fetchOrderById = async () => {
        try {
            const res = await axiosInstance.get(`/returnRequest/orders?keyword=${orderId}`);
            setOrder(res.data.orders[0]);
            setErrorMsg('');
        } catch (error) {
            const message = error.response?.data?.message || 'Order not found or an error occurred.';
            setOrder(null);
            setErrorMsg(message);
            setErrorModal(true);
            toast.error(message);
        }
    };


    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get(`/notifications/userId`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };
    useEffect(() => {
        fetchNotifications().then(() => {
            setShowNotifications(true);
        });
    }, []);

    const openNotifications = () => setShowNotifications(true);

    const isEligibleForReturn = (subOrder) => {
        const status = subOrder.status;
        // if (status === 'Paid') return true;
        if (status === 'Delivered' && subOrder.deliveredAt) {
            const deliveredDate = parseISO(subOrder.deliveredAt);
            return differenceInDays(new Date(), deliveredDate) <= 5;
        }
        return false;
    };

    const openReturnModal = (orderId, subOrderId) => {
        setSelectedSubOrder({ orderId, subOrderId });
        setReturnModal(true);
    };


    const handleReturn = async () => {
        try {
            await axiosInstance.post('/returnRequest/orders/return', {
                orderId: selectedSubOrder.orderId,
                subOrderId: selectedSubOrder.subOrderId,
                reason: returnReason,
                message: returnReason === 'Other' ? customMessage : '',
            });

            const subOrder = order.subOrders.find(sub => sub._id === selectedSubOrder.subOrderId);
            const vendorId = subOrder?.vendorId?._id;

            if (vendorId) {
                try {
                    await axiosInstance.post('/notifications/createNotificationsForVendor', {
                        type: 'Return Request',
                        message: `Customer has requested a return for SubOrder ${selectedSubOrder.subOrderId}`,
                        vendorId,
                    });
                } catch (error) {
                    toast.warn('Return created, but failed to notify vendor.');
                }
            }

            setReturnModal(false);
            setReturnReason('');
            setCustomMessage('');
            fetchOrderById();
            toast.success('Return Request raised. Pending vendor approval.');
        } catch (error) {
            const err = error.response?.data?.error || 'Unable to return the goods';
            toast.error(err);
        }
    };

    const handleCancel = async (orderId, subOrderId, vendorId) => {
        try {
            await axiosInstance.patch('/order/suborder/status', {
                orderId,
                vendorId,
                status: 'Cancelled',
                updatedBy: userId,
            });
            fetchOrderById();
            toast.success('Cancelled the order.');
        } catch (error) {
            const err = error.response?.data?.error || 'Unable to cancel the order';
            toast.error(err);
        }
    };

    return (
        <div className="container my-5">
            <ToastContainer position="top-right" autoClose={3000} />
            <Card className="p-4 shadow-sm">
                <h4 className="mb-3">Search Order</h4>
                <Form className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center mb-3">
                    <Form.Control
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        style={{ minWidth: '250px' }}
                    />
                    <Button onClick={fetchOrderById} variant="primary">Search</Button>
                    <Button variant="info" onClick={openNotifications}>
                        View Notifications
                    </Button>
                </Form>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            </Card>

            <Modal show={errorModal} onHide={() => setErrorModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMsg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setErrorModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {order && (
                <Card className="mt-4 shadow-sm">
                    <Card.Header className="bg-light">
                        <strong>Order ID:</strong> {order._id}
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={4}><strong>Ordered On:</strong> {format(new Date(order.createdAt), 'dd MMM yyyy')}</Col>
                            <Col md={4}><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</Col>
                        </Row>
                        <div className="mb-3">
                            <strong>Shipping Address:</strong>
                            <div className="text-muted">
                                {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                                {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </div>
                        </div>

                        <Table responsive bordered hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Sub Order ID</th>
                                    <th>Product(s)</th>
                                    <th>Quantity</th>
                                    <th>Price (₹)</th>
                                    <th>Vendor</th>
                                    <th>Status</th>
                                    <th>SubTotal</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.subOrders.map((sub) => (
                                    <tr key={sub._id}>
                                        <td className="small">{sub._id}</td>
                                        <td>
                                            {sub.products.map((p) => (
                                                <div key={p.productId._id}>
                                                    <Link to={`/product/${p.productId.productCode}`}>
                                                        {p.productId.productName}
                                                    </Link>
                                                </div>
                                            ))}
                                        </td>
                                        <td>{sub.products.map((p) => p.quantity).join(', ')}</td>
                                        <td>{sub.products.map((p) => `₹${p.priceAtPurchase}`).join(', ')}</td>
                                        <td>{sub.vendorId?.name || 'N/A'}</td>
                                        <td><span className="badge bg-info text-dark">{sub.status}</span></td>
                                        <td>₹{sub.subTotal.toFixed(2)}</td>
                                        <td className="d-flex flex-column gap-2">
                                            {isEligibleForReturn(sub) && (
                                                <Button
                                                    size="sm"
                                                    variant="warning"
                                                    onClick={() => openReturnModal(order._id, sub._id)}
                                                >
                                                    Return
                                                </Button>
                                            )}
                                            {sub.status === 'Paid' && (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleCancel(order._id, sub._id, sub.vendorId._id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Return Modal */}
            <Modal show={returnModal} onHide={() => setReturnModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Return Sub-Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason for Return</Form.Label>
                        <Form.Select
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option value="Damaged item">Damaged item</option>
                            <option value="Wrong size">Wrong size</option>
                            <option value="Packaging issue">Packaging issue</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    {returnReason === 'Other' && (
                        <Form.Group>
                            <Form.Label>Additional Details</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Please provide more details"
                            />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setReturnModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleReturn}>
                        Submit Return
                    </Button>
                </Modal.Footer>
            </Modal>

            {showNotifications && (
                <Notifications
                    notifications={notifications}
                    setShowNotifications={setShowNotifications}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;
