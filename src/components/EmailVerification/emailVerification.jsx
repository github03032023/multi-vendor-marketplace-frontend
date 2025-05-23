import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosSetUp';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('Verification token is missing.');
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/customer/verifyEmail?token=${token}`
        );
        setStatus(response.data.message || 'Email verified successfully! You may now log in.');
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
          'Invalid or expired verification link.'
        );
      }
    };

    verifyEmail();
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

export default EmailVerification;
