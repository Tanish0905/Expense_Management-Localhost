import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterPage.css"; // Custom CSS for styling

const Register = () => {

  const navigate = useNavigate();

  // Handle form submission
  const submitHandler = async (values) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/register`, values);
      message.success("Registration Successful");
      navigate("/login");
    } catch ( error ) {
      message.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  // Prevent logged-in users from accessing the register page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/HomePageDashboard");
    }
  }, [navigate]);

  return (
    <div className="register-container">      
      <div className="register-card">
        <h2 className="register-heading">Expense Tracker</h2>

        <Form layout="vertical" onFinish={submitHandler} className="register-form">
          <h3 className="form-title">Register Form</h3>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input className="custom-input" placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input className="custom-input" type="email" placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input className="custom-input" type="password" placeholder="Password" />
          </Form.Item>

          <div className="form-footer">
            <Link to="/login" className="login-link">Already Registered? Click here to login</Link>
            <button type="submit" className="register-btn">Register</button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
