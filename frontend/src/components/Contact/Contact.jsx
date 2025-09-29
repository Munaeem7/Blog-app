import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about financial planning or want to share feedback? 
              We'd love to hear from you. Reach out and let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      <span className="text-gray-900 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">contact@wealthymiles.com</p>
                      <p className="text-gray-600 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      <span className="text-gray-900 text-xl">💼</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Inquiries</h3>
                      <p className="text-gray-600">partnerships@wealthymiles.com</p>
                      <p className="text-gray-600 text-sm mt-1">For collaborations and partnerships</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      <span className="text-gray-900 text-xl">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                      <p className="text-gray-600">24-48 hours</p>
                      <p className="text-gray-600 text-sm mt-1">For all general inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      <span className="text-gray-900 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Based In</h3>
                      <p className="text-gray-600">United States</p>
                      <p className="text-gray-600 text-sm mt-1">Serving readers worldwide</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">What to Include</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li className="flex items-center">
                      <span className="text-gray-900 mr-2">•</span>
                      Clear description of your inquiry
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-900 mr-2">•</span>
                      Relevant financial context if applicable
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-900 mr-2">•</span>
                      Your preferred contact method
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-green-600 text-lg mr-2">✓</span>
                      <p className="text-green-800 font-medium">
                        Thank you for your message! We've received it and will get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="content-feedback">Content Feedback</option>
                      <option value="technical-issue">Technical Issue</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="guest-posting">Guest Posting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200 resize-vertical"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500">
                      * Required fields
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about WealthyMiles and our content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Do you provide personalized financial advice?",
                answer: "No, WealthyMiles provides educational content only. For personalized financial advice, please consult with a qualified financial advisor who can consider your specific circumstances."
              },
              {
                question: "Can I suggest a topic for an article?",
                answer: "Absolutely! We welcome topic suggestions from our readers. Use the contact form above and select 'Content Feedback' as the subject."
              },
              {
                question: "Do you accept guest posts?",
                answer: "We occasionally accept guest posts from qualified financial professionals. Please use the contact form and select 'Guest Posting' as the subject."
              },
              {
                question: "How often is new content published?",
                answer: "We publish new articles weekly, covering various aspects of personal finance, investing, and wealth building."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Start Your Financial Journey</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            While you wait for our response, explore our latest articles and continue learning about personal finance and wealth building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Articles
            </Link>
            <Link
              to="/about"
              className="bg-transparent text-white px-8 py-3 border border-white rounded-md font-medium text-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;