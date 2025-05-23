import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCommissionForm = () => {
  const [commission, setCommission] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axiosInstance
      .get('/commission/admin/getCommissionPercent')
      .then((res) => {
        setCommission(res.data.commissionPercent);
      })
      .catch(() => toast.error('Failed to load commission rate'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(commission) || commission < 0 || commission > 100) {
      setErrorMsg('Enter a valid percentage between 0 and 100');
      toast.error('Invalid commission value');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.put('/commission/admin/updateCommissionPercent', {
        commissionPercent: Number(commission),
      });
      toast.success('Commission updated successfully');
    } catch (err) {
      toast.error('Failed to update commission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-4 text-center">Update Platform Commission</h4>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="commission">
                  <Form.Label>Commission (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="Enter commission percent"
                  />
                </Form.Group>

                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                <div className="d-grid">
                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Saving...
                      </>
                    ) : (
                      'Update Commission'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCommissionForm;
