import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import { Card, Button, Table, Spinner, Container, Row, Col } from 'react-bootstrap';

const AdminAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/adminDashboard/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (!data) return <div>Error loading data.</div>;

  return (
    <Container>
      <h2 className="my-4">Admin Analytics Dashboard</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4 p-3">
            <h4>Order & Sales Analytics</h4>
            <p>Total Orders: {data.totalOrders}</p>
            <p>Completed Orders: {data.completedOrders}</p>
            <p>Cancelled Orders: {data.cancelledOrders}</p>
            <p>Revenue (Daily): ₹{data.dailyRevenue}</p>
            <p>Revenue (Weekly): ₹{data.weeklyRevenue}</p>
            <p>Revenue (Monthly): ₹{data.monthlyRevenue}</p>
            <p>Total Payments Collected: ₹{data.totalPaymentsCollected}</p>
            <p>Pending Refunds/Failed Payments: ₹{data.failedOrPendingRefunds}</p>
            <h6>Top Payment Methods</h6>
            <ul>
              {data.topPaymentMethods.map((method, idx) => (
                <li key={idx}>{method._id}: {method.count}</li>
              ))}
            </ul>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 p-3">
            <h4>Vendor Performance Analytics</h4>
            <h6>Top Earning Vendors</h6>
            <ul>
              {data.topEarningVendors.map(v => (
                <li key={v._id}>{v.companyName} - ₹{v.totalEarned}</li>
              ))}
            </ul>
            <p>Pending Vendor Payouts: {data.pendingVendorPayouts}</p>
            <h6>Vendors with Most Orders</h6>
            <ul>
              {data.vendorsWithMostOrders.map(v => (
                <li key={v._id}>{v.name} - {v.orderCount} orders</li>
              ))}
            </ul>
            <p>Vendor Approval Rate: {data.approvalRate}%</p>
            <h6>Inactive Vendors</h6>
            <ul>
              {data.inactiveVendors.map(v => (
                <li key={v._id}>{v.companyName}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAnalyticsDashboard;