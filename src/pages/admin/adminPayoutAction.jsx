import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';

const AdminPayoutAction = () => {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchPayoutRequests = async () => {
      try {
        const response = await axiosInstance.get('/payout/admin/getAllVendorPayoutRequests');
        setPayoutRequests(response.data.payoutRequests);
        setLoading(false);
      } catch (err) {
        setError('Error fetching payout requests.');
        setLoading(false);
      }
    };

    fetchPayoutRequests();
  }, []);

  const handlePayoutAction = async (payoutRequestId, action) => {
    try {
      const response = await axiosInstance.post(`/payout/admin/processVendorPayout/${payoutRequestId}`, {
        status: action, // 'Approved' or 'Rejected'
      });

      alert(response.data.message);
      setMessage({
        type: 'success',
        text: response.data.message || `Payout ${action.toLowerCase()} successfully.`,
      });
      // Refresh list after update
      setPayoutRequests((prev) =>
        prev.filter((req) => req._id !== payoutRequestId)
      );
    } catch (err) {
      console.error(err);
      alert(`Error performing ${action} action on payout request.`);
      setMessage({
        type: 'danger',
        text: `Error performing ${action} action on payout request.`,
      });
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4 text-center">Vendor Payout Requests</h4>

              {/* Message Area */}
              {message.text && (
                <div className={`alert alert-${message.type} text-center`} role="alert">
                  {message.text}
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Vendor</th>
                      <th>Order ID</th>
                      <th>SubOrder ID</th>
                      <th>Amount</th>
                      <th>Payout Method</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Requested At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.vendorId?.name || 'N/A'}</td>
                        <td>{request.orderId}</td>
                        <td>{request.subOrderId}</td>
                        <td>₹{request.amount}</td>
                        <td>{request.payoutMethod}</td>
                        <td>{request.notes || '—'}</td>
                        <td><span className={`badge ${request.status === 'Pending' ? 'bg-warning text-dark' : request.status === 'Approved' ? 'bg-success' : 'bg-danger'}`}>{request.status}</span></td>
                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handlePayoutAction(request._id, 'Approved')}
                              disabled={request.status !== 'Pending'}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handlePayoutAction(request._id, 'Rejected')}
                              disabled={request.status !== 'Pending'}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {payoutRequests.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          No payout requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayoutAction;
