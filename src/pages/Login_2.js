import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:9999/users/${formData.email}`);
      const user = response.data;

      if (user && user.password === formData.password) {
        // Store user data in session storage
        sessionStorage.setItem('data', JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role
        }));
        
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("User not found or login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container class1="login-wrapper py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 rounded-12">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary text-decoration-none">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Demo credentials */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="text-muted mb-2">Demo Credentials:</h6>
                  <small className="text-muted">
                    Email: Sincere@april.biz<br />
                    Password: admin123
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
