import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';

const VendorPayoutRequest = () => {
  const [eligibleSubOrders, setEligibleSubOrders] = useState([]);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const [payoutMethod, setPayoutMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  const fetchEligibleSubOrders = async () => {
    setLoading(true);
    try {
      const { from, to } = dateRange;
      const res = await axiosInstance.get('/payout/vendor/getEligibleSubOrders', {
        params: { from, to, search: searchTerm },
      });
      setEligibleSubOrders(res.data.subOrders || []);
    } catch (error) {
      console.error('Failed to fetch eligible suborders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleSubOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubOrder) return alert('Please select a subOrder.');

    const formData = new FormData();
    formData.append('vendorId', selectedSubOrder.vendorId);
    formData.append('orderId', selectedSubOrder.orderId);
    formData.append('subOrderId', selectedSubOrder._id);
    formData.append('amount', selectedSubOrder.vendorEarnings);
    formData.append('payoutMethod', payoutMethod);
    formData.append('notes', notes);

    try {
      const res = await axiosInstance.post('/payout/vendor/vendorPayoutRequest', formData);
      
      if (res.data?.success) {
      alert('Payout request submitted successfully!');
      setSelectedSubOrder(null);
      setNotes('');
      setPayoutMethod('');
      fetchEligibleSubOrders();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit payout request: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSearch = () => {
    fetchEligibleSubOrders();
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Request Vendor Payout</h4>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by SubOrder ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading suborders...</div>
      ) : (
        <div className="form-group mb-4">
          <label>Select Eligible SubOrder</label>
          <select
            className="form-control"
            value={selectedSubOrder?._id || ''}
            onChange={(e) => {
              const subOrder = eligibleSubOrders.find((s) => s._id === e.target.value);
              setSelectedSubOrder(subOrder);
            }}
          >
            <option value="">-- Select SubOrder --</option>
            {eligibleSubOrders.map((s) => (
              <option key={s._id} value={s._id}>
                {s._id} - Rs.{s.vendorEarnings} - Order: {s.orderId}
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {selectedSubOrder && (
          <>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                className="form-control"
                value={selectedSubOrder.vendorEarnings}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Payout Method</label>
              <select
                className="form-control"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                required
              >
                <option value="">-- Select Method --</option>
                <option value="UPI">UPI</option>
                <option value="BankTransfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </>
        )}

        <button className="btn btn-success" type="submit" disabled={!selectedSubOrder}>
          Submit Payout Request
        </button>
      </form>
    </div>
  );
};

export default VendorPayoutRequest;
