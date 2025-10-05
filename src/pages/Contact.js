import React, { useState } from "react";
import Container from "../components/Container";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Container class1="contact-wrapper py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="section-heading text-center mb-5">Contact Us</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-8 mx-auto">
            <div className="row">
              {/* Contact Information */}
              <div className="col-12 col-md-6 mb-4">
                <div className="contact-info">
                  <h3 className="mb-4">Get in Touch</h3>
                  
                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <div className="contact-icon me-3">
                        <i className="fas fa-map-marker-alt text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Address</h6>
                        <p className="text-muted mb-0">123 Coffee Street, Bean City, BC 12345</p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <div className="contact-icon me-3">
                        <i className="fas fa-phone text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <p className="text-muted mb-0">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <div className="contact-icon me-3">
                        <i className="fas fa-envelope text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Email</h6>
                        <p className="text-muted mb-0">info@coffeeshop.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center">
                      <div className="contact-icon me-3">
                        <i className="fas fa-clock text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Hours</h6>
                        <p className="text-muted mb-0">Mon-Fri: 7AM-7PM<br />Sat-Sun: 8AM-6PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-12 col-md-6">
                <div className="contact-form">
                  <h3 className="mb-4">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;
