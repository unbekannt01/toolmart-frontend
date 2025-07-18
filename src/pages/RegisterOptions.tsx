import { Button, Card, CardContent, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";

const RegisterOptions = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Choose Registration Method
          </Typography>

          <Stack spacing={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<PersonIcon />}
              onClick={() => navigate("/register/simple")}
              sx={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(to right, #5a67d8, #6b46c1)",
                },
              }}
              fullWidth
            >
              Simple Register
            </Button>

            <Button
              variant="outlined"
              startIcon={<PhoneAndroidIcon />}
              onClick={() => navigate("/register/otp")}
              sx={{
                borderColor: "#00c853",
                color: "#00c853",
                "&:hover": {
                  backgroundColor: "#e8f5e9",
                  borderColor: "#00c853",
                },
              }}
              fullWidth
            >
              Register Using OTP
            </Button>

            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => navigate("/register/email-token")}
              sx={{
                borderColor: "#2962ff",
                color: "#2962ff",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#2962ff",
                },
              }}
              fullWidth
            >
              Register Using Email Token
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterOptions;
