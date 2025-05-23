import React from 'react';
import { Modal, ListGroup, Badge } from 'react-bootstrap';

const OrderTimelineModal = ({ open, onClose, orderData, subOrderId }) => {
  if (!orderData) return null;
console.log("orderData-",orderData);
  const getHistory = () => {
    if (subOrderId) {
      const subOrder = orderData.subOrders.find(so => so._id === subOrderId);
      return subOrder?.statusHistory || [];
    } else {
      return orderData.statusHistory || [];
    }
  };

  const history = getHistory();
  console.log("history is -", history);

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {subOrderId ? `SubOrder History (${subOrderId})` : `Full Order History (${orderData._id})`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {history.length > 0 ? (
          <ListGroup variant="flush">
            {history.map((entry, index) => (
              <ListGroup.Item key={index}>
                <strong>Status:</strong> <Badge bg="info">{entry.status}</Badge><br />
                <strong>Updated By:</strong> {entry.updatedBy?.name || 'System'}<br />
                <strong>At:</strong> {new Date(entry.updatedAt).toLocaleString()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No history available.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default OrderTimelineModal;
