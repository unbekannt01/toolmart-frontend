/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import api from '../api/axios';

const RegisterUsingEmailToken = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    await api.post(`/v2/auth/register`, formData);
    navigate('/check-your-email');
  };

  return <RegisterForm title="Register Using Email Token" onSubmit={handleSubmit} />;
};

export default RegisterUsingEmailToken;
