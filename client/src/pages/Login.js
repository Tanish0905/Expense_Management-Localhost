import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterPage.css"; // Custom CSS for styling

const Login = () => {
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    try {
      const { data } = await axios.post("/users/login", values);
      message.success("login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/HomePageDashboard");
    } catch (error) {
      message.error("something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/HomePageDashboard");
    }
  }, [navigate]);
  return (
    <>
    <div className="register-container">      
      <div className="register-card">
        <h2 className="register-heading">Expense Tracker</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <h3 className="form-title">Login Form</h3>

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
            <Link to="/register">
              Not a user ? Cleck Here to regsiter
            </Link>
            <button type="submit" className="register-btn">Login</button>
          </div>
        </Form>
      </div>
     </div>
   </>
  );
};

export default Login;