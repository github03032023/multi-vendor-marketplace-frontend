import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosSetUp';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axiosInstance.get(`/adminDashboard/getOrdersById/${orderId}`);
            setOrder(res.data);
        };
        fetchOrder();
    }, [orderId]);

    const formatDate = (isoDateString) => {
        if (!isoDateString) return 'N/A';
        const date = new Date(isoDateString);
        return isNaN(date) ? 'Invalid Date' : date.toLocaleString();
    };

    const getStatusBadge = (status) => {
        const statusColorMap = {
            pending: 'warning',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'danger',
        };
        return <Badge bg={statusColorMap[status?.toLowerCase()] || 'secondary'}>{status}</Badge>;
    };

    if (!order) return <Container className="text-center mt-5">Loading...</Container>;

    return (
        <Container className="my-4">
            <Link to="/adminDashboard">
                <Button variant="dark" className="mb-3">&larr; Back to Dashboard</Button>
            </Link>

            <h2 className="mb-4 text-primary fw-bold">🧾 Order Details</h2>

            {/* Customer Info */}
            <Card className="mb-3 shadow-sm border-0 bg-light">
                <Card.Header className="bg-primary text-white">👤 Customer Information</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}><p><strong>Name:</strong> {order.customerId?.name}</p></Col>
                        <Col md={6}><p><strong>Email:</strong> {order.customerId?.email}</p></Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Shipping Address */}
            <Card className="mb-3 shadow-sm border-0 bg-light">
                <Card.Header className="bg-info text-white">📦 Shipping Address</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Street:</strong> {order.shippingAddress?.street}</p>
                            <p><strong>City:</strong> {order.shippingAddress?.city}</p>
                            <p><strong>State:</strong> {order.shippingAddress?.state}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Postal Code:</strong> {order.shippingAddress?.postalCode}</p>
                            <p><strong>Country:</strong> {order.shippingAddress?.country}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* SubOrders */}
            {order.subOrders.map((sub, idx) => (
                <Card key={sub._id} className="mb-4 shadow border-0">
                    <Card.Header className="bg-secondary text-white">
                        🧩 SubOrder {idx + 1}
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <p><strong>Vendor:</strong> {sub.vendorId?.name}</p>
                                <p><strong>Email:</strong> {sub.vendorId?.email}</p>
                                <p><strong>Company:</strong> {sub.vendorId?.companyDetails.companyName}</p>
                                <p><strong>Status:</strong> {getStatusBadge(sub.status)}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>SubOrder ID:</strong> {sub._id}</p>
                            </Col>
                        </Row>
                        <Table striped bordered hover responsive className="mt-3">
                            <thead className="table-primary">
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Code</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sub.products.map(prod => (
                                    <tr key={prod.productId?._id}>
                                        <td>{prod.productId?.productName}</td>
                                        <td>{prod.productId?.productCode}</td>
                                        <td>Rs.{prod.productId?.price.toFixed(2)}</td>
                                        <td>{prod.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ))}

            {/* Payment Info */}
            {order.paymentId && (
                <Card className="mb-3 shadow-sm border-0 bg-light">
                    <Card.Header className="bg-success text-white">💳 Payment Information</Card.Header>
                    <Card.Body>
                        <p><strong>Method:</strong> {order.paymentId.paymentMethod}</p>
                        <p><strong>Status:</strong> <Badge bg="success">{order.paymentId.paymentStatus}</Badge></p>
                        <p><strong>Transaction ID:</strong> {order.paymentId.transactionId}</p>
                        <p><strong>Paid At:</strong> {formatDate(order.paymentId.paymentDate)}</p>
                    </Card.Body>
                </Card>
            )}

            {/* Order Status History */}
            {order.overallStatusHistory?.length > 0 && (
                <Card className="mb-3 shadow-sm border-0 bg-light">
                    <Card.Header className="bg-dark text-white">📜 Order Status History</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead className="table-dark text-white">
                                <tr>
                                    <th>Status</th>
                                    <th>Updated By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.overallStatusHistory.map((entry, i) => (
                                    <tr key={i}>
                                        <td>{entry.status}</td>
                                        <td>{entry.updatedBy?.name || 'System'}</td>
                                        <td>{formatDate(entry.updatedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* SubOrder Status History */}
            {order.subOrders.map(sub =>
                sub.statusHistory?.length > 0 && (
                    <Card key={`${sub._id}-status`} className="mb-3 shadow-sm border-0 bg-light">
                        <Card.Header className="bg-warning text-dark">
                            🔄 SubOrder {sub._id} Status History
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead className="table-warning">
                                    <tr>
                                        <th>Status</th>
                                        <th>Updated By</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sub.statusHistory.map((entry, i) => (
                                        <tr key={i}>
                                            <td>{entry.status}</td>
                                            <td>{entry.updatedBy?.name || 'System'}</td>
                                            <td>{formatDate(entry.updatedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )
            )}
        </Container>
    );
};

export default OrderDetailPage;
