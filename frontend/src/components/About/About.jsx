import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About WealthyMiles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted companion in the journey towards financial wisdom, 
              smart investments, and lifelong wealth creation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize financial education and empower individuals with 
                practical knowledge that transforms their financial future. We believe 
                that everyone deserves access to clear, actionable financial guidance.
              </p>
              <p className="text-lg text-gray-600">
                Through meticulously researched articles, expert insights, and 
                real-world case studies, we bridge the gap between complex financial 
                concepts and everyday decision-making.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600">
                We envision a world where financial literacy is not a privilege but 
                a fundamental life skill. Where individuals from all walks of life 
                can confidently navigate their financial journeys and build lasting 
                wealth for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial insights across various domains to guide your 
              wealth-building journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Investment Strategies",
                description: "From stock market fundamentals to advanced portfolio management techniques.",
                icon: "📈"
              },
              {
                title: "Personal Finance",
                description: "Budgeting, saving, debt management, and financial planning for all life stages.",
                icon: "💰"
              },
              {
                title: "Market Analysis",
                description: "In-depth analysis of market trends, economic indicators, and investment opportunities.",
                icon: "🔍"
              },
              {
                title: "Retirement Planning",
                description: "Strategies to build retirement corpus and ensure financial independence.",
                icon: "🏖️"
              },
              {
                title: "Tax Optimization",
                description: "Legal ways to minimize tax liability and maximize wealth accumulation.",
                icon: "📊"
              },
              {
                title: "Wealth Preservation",
                description: "Estate planning, insurance, and asset protection strategies.",
                icon: "🛡️"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Integrity",
                description: "We provide honest, unbiased information without hidden agendas or promotional content."
              },
              {
                title: "Excellence",
                description: "Every piece of content is thoroughly researched, verified, and crafted with precision."
              },
              {
                title: "Clarity",
                description: "We break down complex financial concepts into understandable, actionable insights."
              },
              {
                title: "Empowerment",
                description: "Our goal is to equip you with knowledge that leads to confident financial decisions."
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {value.title.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Expertise</h2>
            <p className="text-lg text-gray-600 mb-8">
              WealthyMiles is powered by a team of financial experts, analysts, 
              and writers with decades of combined experience in finance, investment 
              banking, and economic research. Our contributors include CFA charterholders, 
              financial advisors, and industry professionals who are passionate about 
              financial education.
            </p>
            <p className="text-lg text-gray-600">
              We maintain strict editorial standards to ensure that every article 
              published meets our criteria for accuracy, relevance, and practical value. 
              Our content is regularly updated to reflect current market conditions and 
              regulatory changes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Journey Today</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who are already transforming their financial future 
            with WealthyMiles. Explore our articles, gain new insights, and take control 
            of your financial destiny.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Explore Articles
            </Link>
            <Link
              to="/contact"
              className="bg-white text-gray-900 px-8 py-3 border border-gray-900 rounded-md font-medium text-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300 text-sm">
            Disclaimer: The content provided on WealthyMiles is for educational and 
            informational purposes only.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;