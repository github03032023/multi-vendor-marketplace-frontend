import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosSetUp';

const VendorEmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyVendorEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('Verification token is missing.');
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/vendor/verifyVendorEmail?token=${token}`
        );
        setStatus(response.data.message || 'Email verified successfully! You may login once your credentials are approved by Admin.');
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
          'Invalid or expired verification link.'
        );
      }
    };

    verifyVendorEmail();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VendorEmailVerification;
