import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  BookOpen, 
  Mail,
  Shield,
  User,
  Globe,
  Copyright,
  ThumbsUp
} from 'lucide-react';

const TermsAndConditions = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "Acceptance of Terms",
      content: `By accessing and using WealthyMiles ("the Blog"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of those changes.`
    },
    {
      icon: User,
      title: "User Responsibilities",
      content: `You agree to use the Blog only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Blog. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Blog.`
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      content: `All content published on WealthyMiles, including but not limited to articles, images, graphics, logos, and digital downloads, is the property of WealthyMiles and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.`
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer of Warranties",
      content: `The content on WealthyMiles is provided for general information and educational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.`
    },
    {
      icon: Shield,
      title: "Limitation of Liability",
      content: `WealthyMiles and its authors will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of the Blog. This includes any financial decisions made based on information provided on our website. Always consult with qualified financial advisors before making investment decisions.`
    },
    {
      icon: Globe,
      title: "External Links",
      content: `Our Blog may contain links to external websites that are not provided or maintained by us. We do not endorse and are not responsible for the content, privacy policies, or practices of any third-party websites. You access these links at your own risk.`
    },
    {
      icon: ThumbsUp,
      title: "User-Generated Content",
      content: `Users may post comments and engage in discussions on our Blog. By posting content, you grant WealthyMiles a non-exclusive, royalty-free license to use, reproduce, and display such content. We reserve the right to remove any user-generated content that we deem inappropriate, offensive, or in violation of these terms.`
    },
    {
      icon: Copyright,
      title: "Copyright Complaints",
      content: `If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us at legal@wealthymiles.com with detailed information about the alleged infringement. We will promptly investigate and take appropriate action.`
    },
    {
      icon: Mail,
      title: "Termination",
      content: `We reserve the right to terminate or suspend access to our Blog immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive.`
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using WealthyMiles
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div 
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Important Legal Notice
              </h3>
              <p className="text-gray-700">
                The information on WealthyMiles is for educational and informational purposes only. 
                We are not financial advisors, and the content should not be considered financial advice. 
                Always consult with qualified professionals before making financial decisions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section, index) => (
            <motion.section 
              key={section.title}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <section.icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {section.content}
                </p>
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Governing Law */}
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Scale className="h-6 w-6 text-blue-600 mr-3" />
            Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            These Terms shall be governed and construed in accordance with the laws of the United States, 
            without regard to its conflict of law provisions. Any disputes arising from these Terms or your 
            use of the Blog shall be subject to the exclusive jurisdiction of the courts located in New York, NY.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-gray-600 mr-3" />
            Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Email: legal@wealthymiles.com</p>
            <p className="text-gray-700">We typically respond to legal inquiries within 5-7 business days.</p>
          </div>
        </motion.div>

        {/* Acceptance Section */}
        <motion.div 
          className="text-center mt-12 p-8 border-2 border-green-200 bg-green-50 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <ThumbsUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You for Reading
          </h3>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            By using WealthyMiles, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms and Conditions. We're committed to 
            providing valuable travel and financial content while maintaining a 
            respectful and lawful online community.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;