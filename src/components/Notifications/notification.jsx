// import { Modal, Button, ListGroup } from 'react-bootstrap';

// const Notifications = ({ notifications, setShowNotifications }) => {
//   return (
//     <Modal show={true} onHide={() => setShowNotifications(false)} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Your Notifications</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//       <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//         <ListGroup>
//           {notifications.length > 0 ? (
//             notifications.map((notif) => (
//               <ListGroup.Item key={notif._id}>
//                 <strong>{notif.type}</strong>: {notif.message}
//               </ListGroup.Item>
//             ))
//           ) : (
//             <ListGroup.Item>No new notifications.</ListGroup.Item>
//           )}
//         </ListGroup>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowNotifications(false)}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default Notifications;



import { Modal, Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';

const Notifications = ({ notifications, setShowNotifications }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [localNotifications, setNotifications] = useState(notifications || []);


  useEffect(() => {
    const hasShownNotificationAlert = sessionStorage.getItem('hasShownNotificationAlert');
  
    if (!hasShownNotificationAlert && localNotifications.length >= 50) {
      alert("You have 50 or more notifications detected. Please delete some to view the old ones. Select the ones you wish to delete, then click 'Delete Selected'.");
      sessionStorage.setItem('hasShownNotificationAlert', 'true');
    }
  }, [localNotifications]);

  const onDeleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const onBatchDelete = async (ids) => {
    try {
      await axiosInstance.post(`/notifications/batch-delete`, { ids });
      setNotifications((prev) => prev.filter((n) => !ids.includes(n._id)));
    } catch (err) {
      console.error("Batch delete failed", err);
    }
  };

  const handleSingleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      onDeleteNotification(id);
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one notification to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the selected notifications?")) {
      onBatchDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <Modal show={true} onHide={() => setShowNotifications(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <ListGroup>
            {localNotifications.length > 0 ? (
              localNotifications.map((notif) => (
                <ListGroup.Item key={notif._id}>
                  <Row className="align-items-center">
                    <Col xs={1}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(notif._id)}
                        onChange={() => handleCheckboxChange(notif._id)}
                      />
                    </Col>
                    <Col xs={9}>
                      <strong>{notif.type}</strong>: {notif.message}
                    </Col>
                    <Col xs={2} className="text-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleSingleDelete(notif._id)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No new notifications.</ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={handleBatchDelete}
          disabled={selectedIds.length === 0}
        >
          Delete Selected ({selectedIds.length})
        </Button>
        <Button variant="secondary" onClick={() => setShowNotifications(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Notifications;
