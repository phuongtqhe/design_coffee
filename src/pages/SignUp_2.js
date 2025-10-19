import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Create new user object
      const newUser = {
        id: formData.email,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "Customer",
        address: {
          country: "",
          state: "",
          city: "",
          detailAddress: "",
          zipcode: ""
        }
      };

      // For demo purposes, we'll just show success message
      // In a real app, you'd POST to create the user
      console.log("New user:", newUser);
      
      toast.success("Account created successfully! Please sign in.");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container class1="signup-wrapper py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 rounded-12">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title">Create Account</h2>
                  <p className="text-muted">Join our coffee community</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

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

                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary text-decoration-none">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SignUp;
