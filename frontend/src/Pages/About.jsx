import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  TrendingUp,
  Plane,
  Shield,
  Heart,
  Mail,
  Linkedin,
  Twitter,
  MapPin,
  Calendar
} from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Muhammad Ahmad",
      role: "CEO",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      bio: "Former financial analyst turned travel enthusiast. Sarah combines her expertise in finance with her passion for exploration to help others achieve financial freedom through smart travel.",
      email: "muhammadahmadsidhu26.com",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen"
    },
    {
      name: "Zohaib Ali Virk",
      role: "Head of Content & Travel Expert",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      bio: "With over 50 countries visited, Marcus brings firsthand experience in budget travel, luxury experiences, and everything in between. His expertise lies in maximizing value while exploring the world.",
      email: "zohaibvirk@gmail.com",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      twitter: "https://twitter.com/marcusrod"
    },
    {
      name: "Sidhu Moose Wala",
      role: "Financial Strategist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      bio: "PhD in Economics with 15 years in wealth management. Emily specializes in creating sustainable financial plans that enable long-term travel and early retirement strategies.",
      email: "emily@wealthymiles.com",
      linkedin: "https://linkedin.com/in/emilywatson",
      twitter: "https://twitter.com/emilywatsonphd"
    }
  ];

  const stats = [
    { icon: Globe, number: "75+", label: "Countries Covered" },
    { icon: Users, number: "50K+", label: "Monthly Readers" },
    { icon: Award, number: "500+", label: "Published Guides" },
    { icon: TrendingUp, number: "$2M+", label: "Saved for Readers" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We provide honest, data-driven advice you can rely on for your financial and travel decisions."
    },
    {
      icon: Target,
      title: "Actionable Insights",
      description: "Every piece of content is designed to deliver practical, implementable strategies for real results."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We're building a community of like-minded individuals passionate about financial freedom through travel."
    },
    {
      icon: Plane,
      title: "Adventure & Growth",
      description: "We believe travel and financial growth go hand-in-hand in creating a fulfilling life."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About WealthyMiles
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where Financial Freedom Meets Global Adventure
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Plane className="h-6 w-6" />
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At WealthyMiles, we're on a mission to democratize financial freedom through smart travel. 
              We believe that exploring the world shouldn't be a luxury reserved for the wealthy, but an 
              achievable goal for anyone with the right financial strategies and travel insights.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
              >
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate experts combining financial wisdom with real-world travel experience
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-semibold mb-4">{member.role}</div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                  
                  <div className="flex space-x-3">
                    <a 
                      href={`mailto:${member.email}`}
                      className="p-2 bg-gray-200 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gray-600" />
                    </a>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-200 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-gray-600" />
                    </a>
                    <a 
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-200 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-gray-600" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at WealthyMiles
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <value.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Details Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">About Our Blog</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes WealthyMiles your ultimate resource for travel and finance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6">What We Cover</h3>
              <div className="space-y-4">
                {[
                  "Credit Card Rewards & Travel Hacking",
                  "Budget Travel Planning & Destination Guides",
                  "Investment Strategies for Travel Enthusiasts",
                  "Passive Income for Digital Nomads",
                  "Luxury Travel on a Smart Budget",
                  "Retirement Planning with Travel Goals"
                ].map((topic, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{topic}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  WealthyMiles was born from a simple observation: most people either focus on 
                  saving money or spending it on travel, but rarely both. We bridge that gap.
                </p>
                <p>
                  Founded in 2020, we've helped thousands of readers save millions while 
                  exploring the world. Our approach combines data-driven financial advice 
                  with real-world travel experience.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span>Based in New York, Serving Globally</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>Founded in 2020</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start Your WealthyMiles Journey Today
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of 50,000+ readers who are transforming their finances 
              while exploring the world.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Our Latest Guides
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;