import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import OrderTimelineModal from '../OrderTimelineModal';
import { Button, Container, Row, Col, Form, Badge, Card, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from '../../components/Notifications/notification';

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Paid');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrderId, setSelectedSubOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialogOrderId, setConfirmDialogOrderId] = useState(null);
  const [confirmDialogSubOrderId, setConfirmDialogSubOrderId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectDialogOrderId, setRejectDialogOrderId] = useState(null);
  const [rejectDialogSubOrderId, setRejectDialogSubOrderId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [showReturnDetailsModal, setShowReturnDetailsModal] = useState(false);
  const [returnRequestDetails, setReturnRequestDetails] = useState(null);

  const vendorId = localStorage.getItem('vendorId');
  const updatedBy = vendorId;

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(`/vendorDashboard/vendor/${vendorId}`);
      setOrders(res.data);
      filterOrdersByStatus(res.data, selectedStatus);
    } catch (err) {
      console.error('Failed to load vendor orders', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/notifications/vendorId`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchNotifications().then(() => {
      setShowNotifications(true);
    });
  }, []);

  const openNotifications = () => setShowNotifications(true);

  const filterOrdersByStatus = (orders, status) => {
    const filtered = orders.filter(order =>
      order.subOrders.some(subOrder =>
        subOrder.status === status && subOrder.vendorId._id.toString() === vendorId.toString()
      )
    );
    setFilteredOrders(filtered);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterOrdersByStatus(orders, status);
  };

  const openTimelineModal = (orderId, subOrderId) => {
    const orderData = orders.find(order => order._id === orderId);
    if (orderData) {
      setSelectedOrder(orderData);
      setSelectedSubOrderId(subOrderId); // could be null for full order history
      setIsModalOpen(true);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/order/suborder/status`, {
        orderId,
        vendorId,
        status: newStatus,
        updatedBy
      });
      toast.success(`Status set to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update', {
        description: error.response?.data?.error || 'Something went wrong'
      });
    }
  };

  const approveReturnAndRefund = async (orderId, subOrderId) => {
    try {
      await axiosInstance.patch(`/vendorDashboard/order/${orderId}/suborder/${subOrderId}/approve-return`);
      toast.success('Refund Successful.Return approved and refund issued.');
      fetchOrders();
    } catch (error) {
      toast.error('Refund Failed. Could not process refund.');
    } finally {
      setConfirmDialogOrderId(null);
      setConfirmDialogSubOrderId(null);
    }
  };


  const handleConfirm = () => {
    if (confirmDialogOrderId && confirmDialogSubOrderId) {
      approveReturnAndRefund(confirmDialogOrderId, confirmDialogSubOrderId);
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setConfirmDialogOrderId(null);
    setConfirmDialogSubOrderId(null);
    setShowConfirmDialog(false);
  };

  const rejectReturnRequest = async (orderId, subOrderId, reason) => {
    try {
      await axiosInstance.patch(`/vendorDashboard/order/${orderId}/suborder/${subOrderId}/reject-return`, {
        rejectionReason: reason,
        updatedBy: updatedBy
      });
      toast.success('Return request rejected successfully.');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to reject return request.');
    } finally {
      setRejectDialogOrderId(null);
      setRejectDialogSubOrderId(null);
      setRejectionReason('');
      setShowRejectDialog(false);
    }
  };

  const handleViewReturnRequestDetails = async (orderId, subOrderId) => {
    try {
      const response = await axiosInstance.get(`/returnRequest/order/${orderId}/suborder/${subOrderId}/fetchReturnRequestDetails`);
      setReturnRequestDetails(response.data);
      setShowReturnDetailsModal(true);
    } catch (error) {
      toast.error('Failed to fetch return request details.');
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      filterOrdersByStatus(orders, selectedStatus);
    } else {
      const filtered = orders.filter(order =>
        order.subOrders.some(subOrder =>
          subOrder._id.includes(searchTerm) && subOrder.vendorId._id.toString() === vendorId.toString()
        )
      );
      setFilteredOrders(filtered);
    }
  };


  return (
    <Container className="my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* <Row className="align-items-center mb-4">
        <h2 className="fw-bold text-primary">Vendor Dashboard</h2>
      </Row> */}
      <Row className="align-items-center mb-4 justify-content-between">
        <Col><h2 className="fw-bold text-primary">Vendor Dashboard</h2></Col>
        <Col className="text-end">
          <Button variant="info" onClick={openNotifications}>
            View Notifications
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Form.Control
            type="text"
            placeholder="Search by SubOrder ID"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>

        <Col xs={12} md={6}>
          <h6 className="fw-semibold">Vendor Order Status :</h6>
          <Form.Select onChange={(e) => handleStatusChange(e.target.value)} value={selectedStatus}>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
            <option value="Return Requested">Return Requested</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="align-items-center mb-4">
        <Col xs={12} md={12}>
          {orders.some(order =>
            order.subOrders.some(subOrder =>
              subOrder.status === 'Return Requested' && subOrder.vendorId._id === vendorId
            )
          ) && (
              <Card className="mb-4 shadow-sm border-danger">
                <Card.Body>
                  <h5 className="text-danger fw-bold">⚠️ Return Requests Pending Approval</h5>
                  {orders.map(order =>
                    order.subOrders
                      .filter(subOrder =>
                        subOrder.status === 'Return Requested' && subOrder.vendorId._id === vendorId
                      )
                      .map(subOrder => (
                        <div key={subOrder._id} className="border-top pt-3 mt-3">
                          <h6 className="fw-semibold mb-2">
                            Order ID: {order._id} | SubOrder ID: {subOrder._id}
                          </h6>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <Button
                              variant="warning"
                              onClick={() => {
                                setConfirmDialogOrderId(order._id);
                                setConfirmDialogSubOrderId(subOrder._id);
                                setShowConfirmDialog(true);
                              }}
                            >
                              Approve Return & Refund
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => {
                                setRejectDialogOrderId(order._id);
                                setRejectDialogSubOrderId(subOrder._id);
                                setShowRejectDialog(true);
                              }}
                            >
                              Reject Return
                            </Button>
                            <Button
                              variant="info"
                              onClick={() => handleViewReturnRequestDetails(order._id, subOrder._id)}
                            >
                              View Return Request Details
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </Card.Body>
              </Card>
            )}
        </Col>


      </Row>

      {filteredOrders.map((order) => (
        <Card key={order._id} className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="mb-3">
              <Col xs={12} md={8}>
                <h5 className="text-info" role="button">
                  Order ID: {order._id}
                </h5>
              </Col>
              <Col xs={12} md={4} className="text-md-end">
                <span className="me-2 fw-semibold">Customer Order Status:</span>
                <Badge bg="secondary">{order.overallStatus}</Badge>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <h6 className="fw-semibold">Products Purchased</h6>
                {order.subOrders[0].products.map((product, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2 bg-light">
                    <div className="mb-1 small"><strong>Product Name:</strong> {product.productId.productName}</div>
                    <div className="mb-1 small"><strong>Quantity:</strong> {product.quantity}</div>
                    <div className="mb-1 small"><strong>Price:</strong> ₹{product.priceAtPurchase}</div>
                    <div className="mb-1 small"><strong>Category:</strong> {product.productId.category}</div>
                  </div>
                ))}
              </Col>

              <Col md={6} className="mb-3">
                <h6 className="fw-semibold">Payment Info</h6>
                <p className="small">Method: {order.paymentId?.paymentMethod}</p>
                <p className="small">Status: {order.paymentId?.paymentStatus}</p>
                <p className="small">Txn ID: {order.paymentId?.transactionId}</p>
              </Col>

              <Col md={6} className="mb-3">
                <h6 className="fw-semibold">Shipping Address</h6>
                <p className="small">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <p className="small">{order.shippingAddress.country}</p>
              </Col>

              <Col md={6} className="mb-3">
                <h6 className="fw-semibold">Customer Details</h6>
                <p className="small">{order.customerId?.name}</p>
                <p className="small">{order.customerId?.email}</p>
                <p className="small">{order.customerId?.phone}</p>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                {order.subOrders
                  .filter(subOrder => subOrder.vendorId._id === vendorId) // filter by current vendor
                  .map((subOrder, index) => (
                    <div key={subOrder._id} className="border-top pt-3 mt-3">
                      <h6 className="fw-semibold mb-2">
                        Vendor Order ID ({subOrder._id}){' '}
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="ms-2"
                          onClick={() => openTimelineModal(order._id, subOrder._id)}
                        >
                          View History
                        </Button>
                      </h6>

                      <div className="mb-2">
                        <strong>Vendor Order Status:</strong> <Badge bg="info">{subOrder.status}</Badge>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {subOrder.status === 'Paid' && (
                          <Button
                            variant="primary"
                            onClick={() => updateOrderStatus(order._id, 'Shipped')}
                          >
                            Ship
                          </Button>
                        )}
                        {subOrder.status === 'Shipped' && (
                          <Button
                            variant="success"
                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        {(subOrder.status === 'Paid') && (
                          <Button
                            variant="danger"
                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                          >
                            Cancel
                          </Button>
                        )}
                        {subOrder.status === 'Return Requested' && (
                          <Button
                            variant="warning"
                            onClick={() => setConfirmDialogOrderId(order._id)}
                          >
                            Approve Return & Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <OrderTimelineModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={selectedOrder}
        subOrderId={selectedSubOrderId}
      />

      {/* Confirmation Dialog for Approve Return & Refund*/}
      <Modal show={showConfirmDialog} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Return & Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to approve the return and issue a refund for this order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Confirmation Dialog for Reject Return & Refund*/}
      <Modal show={showRejectDialog} onHide={() => setShowRejectDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Return Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rejectionReason">
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejecting the return request"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              rejectReturnRequest(rejectDialogOrderId, rejectDialogSubOrderId, rejectionReason)
            }
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showReturnDetailsModal} onHide={() => setShowReturnDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Return Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {returnRequestDetails ? (
            <>
              <p><strong>Customer Name:</strong> {returnRequestDetails.customerId.name}</p>
              <p><strong>Order ID:</strong> {returnRequestDetails.orderId}</p>
              <p><strong>SubOrder ID:</strong> {returnRequestDetails.subOrderId}</p>
              <p><strong>Reason For Return:</strong> {returnRequestDetails.reason}</p>
              {returnRequestDetails.message && (
                <p><strong>Message(if reason is Other):</strong> {returnRequestDetails.message}</p>
              )}
              <p><strong>Status:</strong> {returnRequestDetails.status}</p>
              {returnRequestDetails.rejectionReason && (
                <p><strong>Rejection Reason:</strong> {returnRequestDetails.rejectionReason}</p>
              )}
              <h6>Status History:</h6>

              <p><strong>Return Request Date:</strong> {new Date(returnRequestDetails.createdAt).toLocaleString()}
              </p>
              {/* if ({returnRequestDetails.status === 'Approved'}){
                <p><strong>Return Request Approved Date:</strong> {new Date(returnRequestDetails.updatedAt).toLocaleString()}</p>
              }else if ({returnRequestDetails.status === 'Rejected'}){
                <p><strong>Return Request Rejected Date:</strong> {new Date(returnRequestDetails.updatedAt).toLocaleString()}</p>
              } */}

            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReturnDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {showNotifications && (
        <Notifications
          notifications={notifications}
          setShowNotifications={setShowNotifications}
        />
      )}
    </Container>
  );
};

export default VendorDashboard;


