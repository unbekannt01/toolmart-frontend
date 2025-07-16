/* eslint-disable @typescript-eslint/no-explicit-any */
import RegisterForm from './RegisterForm';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RegisterSimple = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    await api.post(`/v3/auth/register`, formData);
    navigate('/login');
  };

  return <RegisterForm title="Simple Registration" onSubmit={handleSubmit} />;
};

export default RegisterSimple;
