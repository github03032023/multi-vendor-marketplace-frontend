import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Badge, Card, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosSetUp';
import OrderTimelineModal from '../OrderTimelineModal';
import Notifications from '../../components/Notifications/notification';

const AdminOrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});
    const [filters, setFilters] = useState({
        vendorName: '',
        customerName: '',
        mainOrderId: '',
        subOrderId: '',
        startDate: '',
        endDate: '',
        orderStatus: '',
        subOrderStatus: ''
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);


    const fetchStatusCounts = async () => {
        const res = await axiosInstance.get('/adminDashboard/status-stats');
        setStatusCounts(res.data.stats);
    };

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get(`/notifications/userId`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };
    const searchOrders = async (page = 1) => {
        const res = await axiosInstance.post('/adminDashboard/orders/search', {
            ...filters,
            page,
            pageSize
        });
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setCurrentPage(page);
    };

    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const cancelOrder = async (subOrderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        await axiosInstance.patch(`/adminDashboard/cancelSuborder/${subOrderId}`);
        await searchOrders(currentPage);
    };

    useEffect(() => {
        fetchStatusCounts();
        searchOrders();
        fetchNotifications().then(() => {
            setShowNotifications(true);
        });
    }, []);
    const openNotifications = () => setShowNotifications(true);

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => searchOrders(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return (
            <Pagination>
                <Pagination.Prev onClick={() => currentPage > 1 && searchOrders(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => currentPage < totalPages && searchOrders(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-primary">Admin Order Management</h2>

            {/* Search Filters */}
            {/* <Card className="p-3 mb-4 shadow-sm">
                <Row className="g-3">
                    <Col md><Form.Control placeholder="Vendor Name" name="vendorName" onChange={handleInputChange} /></Col>
                    <Col md><Form.Control placeholder="Customer Name" name="customerName" onChange={handleInputChange} /></Col>
                    <Col md><Form.Control placeholder="Main Order ID" name="mainOrderId" onChange={handleInputChange} /></Col>
                    <Col md><Form.Control placeholder="SubOrder ID" name="subOrderId" onChange={handleInputChange} /></Col>
                    <Col md><Form.Control type="date" name="startDate" onChange={handleInputChange} /></Col>
                    <Col md><Form.Control type="date" name="endDate" onChange={handleInputChange} /></Col>
                    <Col md>
                        <Form.Select name="orderStatus" onChange={handleInputChange}>
                            <option value="">Order Status</option>
                            <option value="Processing">Processing</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Partially Shipped">Partially Shipped</option>
                            <option value="Partially Delivered">Partially Delivered</option>
                        </Form.Select>
                    </Col>
                    <Col md>
                        <Form.Select name="subOrderStatus" onChange={handleInputChange}>
                            <option value="">SubOrder Status</option>
                            <option value="Processing">Processing</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                    </Col>
                    <Col md="auto">
                        <Button onClick={() => searchOrders(1)}>Search</Button>
                        <Button variant="secondary" onClick={() => {
                            setFilters({
                                vendorName: '',
                                customerName: '',
                                mainOrderId: '',
                                subOrderId: '',
                                startDate: '',
                                endDate: '',
                                orderStatus: '',
                                subOrderStatus: ''
                            });
                            searchOrders(1);
                        }}>Clear</Button>
                    </Col>
                </Row>
            </Card> */}


            <Card className="p-3 mb-4 shadow-sm">
                <Form>
                    {/* Row 1 */}
                    <Row className="mb-3 g-3">
                        <Col md={4}>
                            <Form.Control placeholder="Vendor Name" name="vendorName" value={filters.vendorName} onChange={handleInputChange} />
                        </Col>
                        <Col md={4}>
                            <Form.Control placeholder="Customer Name" name="customerName" value={filters.customerName} onChange={handleInputChange} />
                        </Col>
                        <Col md={4}>
                            <Form.Control placeholder="Main Order ID" name="mainOrderId" value={filters.mainOrderId} onChange={handleInputChange} />
                        </Col>
                    </Row>

                    {/* Row 2 */}
                    <Row className="mb-3 g-3">
                        <Col md={3}>
                            <Form.Control placeholder="SubOrder ID" name="subOrderId" value={filters.subOrderId} onChange={handleInputChange} />
                        </Col>
                        <Col md={3}>
                            <Form.Control type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
                        </Col>
                        <Col md={3}>
                            <Form.Control type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
                        </Col>
                        <Col md={3}>
                            <Form.Select name="orderStatus" value={filters.orderStatus} onChange={handleInputChange}>
                                <option value="">Order Status</option>
                                <option value="Processing">Processing</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Partially Shipped">Partially Shipped</option>
                                <option value="Partially Delivered">Partially Delivered</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Row 3 */}
                    <Row className="mb-3 g-3">
                        <Col md={3}>
                            <Form.Select name="subOrderStatus" value={filters.subOrderStatus} onChange={handleInputChange}>
                                <option value="">SubOrder Status</option>
                                <option value="Processing">Processing</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                        </Col>
                        <Col md="auto" className="d-flex align-items-center gap-2">
                            <Button variant="primary" onClick={() => searchOrders(1)}>Search</Button>
                            <Button variant="secondary" onClick={() => {
                                setFilters({
                                    vendorName: '',
                                    customerName: '',
                                    mainOrderId: '',
                                    subOrderId: '',
                                    startDate: '',
                                    endDate: '',
                                    orderStatus: '',
                                    subOrderStatus: ''
                                });
                                searchOrders(1);
                            }}>Clear</Button>
                        </Col>
                        <Col md={3}>
                            <Button variant="info" onClick={openNotifications}>
                                View Notifications
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>


            {/* Order Status Counts */}
            <Row className="mb-3">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Col key={status} className="text-center">
                        <Badge bg="dark" className="fs-6">{status}: {count}</Badge>
                    </Col>
                ))}
            </Row>

            {/* Orders Table */}
            <Card className="shadow-sm">
                <Table striped hover responsive>
                    <thead className="table-light">
                        <tr>
                            <th>Main Order ID</th>
                            <th>SubOrder ID</th>
                            <th>Customer Name</th>
                            <th>Vendor Name</th>
                            <th>Order Status</th>
                            <th>SubOrder Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            order.subOrders.map(sub => (
                                <tr key={sub._id}>
                                    <td>{order._id}</td>
                                    <td>{sub._id}</td>
                                    <td>
                                        {order.customerId?.name}
                                    </td>
                                    <td>
                                        {sub.vendorName}
                                    </td>
                                    <td><Badge bg="secondary">{order.overallStatus}</Badge></td>
                                    <td><Badge bg="info">{sub.status}</Badge></td>
                                    <td>
                                        {/* <Button variant="outline-primary" size="sm" onClick={() => {
                                            setSelectedOrder({ order, subOrderId: sub._id });
                                            setIsModalOpen(true);
                                        }}>
                                            View Timeline
                                        </Button>{' '} */}

                                        <Link to={`/admin/orders/${order._id}`}>
                                            <Button variant="outline-secondary" size="sm">View Details</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    {renderPagination()}
                </div>
            </Card>

            <OrderTimelineModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orderData={selectedOrder?.order}
                subOrderId={selectedOrder?.subOrderId}
            />
            {showNotifications && (
                <Notifications
                    notifications={notifications}
                    setShowNotifications={setShowNotifications}
                />
            )}
        </Container>
    );
};

export default AdminOrderDashboard;
