import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type FormData = {
  email: string;
  otp: string;
};

const RegisterUsingOtp = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    await api.post(`/v1/auth/register`, formData);
    navigate(`/verify-otp?email=${formData.email}`);
  };

  return <RegisterForm title="Register Using OTP" onSubmit={handleSubmit} />;
};

export default RegisterUsingOtp;
