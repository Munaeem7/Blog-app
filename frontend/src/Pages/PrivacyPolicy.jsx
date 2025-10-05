import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  FileText, 
  Mail,
  Cookie,
  Server,
  Globe
} from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you subscribe to our newsletter, create an account, or contact us, we may collect: your name, email address, and any other information you voluntarily provide."
        },
        {
          subtitle: "Automatically Collected Information",
          text: "We automatically collect certain information about your device and usage patterns, including: IP address, browser type, device type, pages visited, time spent on pages, and referring website."
        },
        {
          subtitle: "Cookies and Tracking",
          text: "We use cookies and similar tracking technologies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings."
        }
      ]
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "To deliver our blog content, personalize your experience, and provide customer support when needed."
        },
        {
          subtitle: "Communication",
          text: "To send you newsletters, updates about new travel and finance content, and respond to your inquiries."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "To analyze how users interact with our content, improve our website functionality, and develop new features."
        },
        {
          subtitle: "Legal Compliance",
          text: "To comply with applicable laws, regulations, and legal processes."
        }
      ]
    },
    {
      icon: Server,
      title: "Data Sharing and Disclosure",
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who assist us in operating our website, conducting analytics, or sending communications."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law, to protect our rights, or to ensure the safety of our users and the public."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction."
        },
        {
          subtitle: "Aggregated Data",
          text: "We may share aggregated, anonymized data that does not identify individual users for analytical or marketing purposes."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          subtitle: "Data Retention",
          text: "We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."
        },
        {
          subtitle: "Secure Connections",
          text: "Our website uses SSL encryption to protect data transmitted between your browser and our servers."
        }
      ]
    },
    {
      icon: Globe,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, correct, or update your personal information at any time through your account settings or by contacting us."
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your personal data in a structured, machine-readable format."
        },
        {
          subtitle: "Deletion Rights",
          text: "You may request deletion of your personal information, subject to certain legal obligations we may have."
        },
        {
          subtitle: "Marketing Communications",
          text: "You can unsubscribe from our marketing emails at any time by clicking the 'unsubscribe' link in any email or contacting us directly."
        },
        {
          subtitle: "Cookie Preferences",
          text: "You can manage your cookie preferences through your browser settings. Note that disabling cookies may affect website functionality."
        }
      ]
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking Technologies",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "Required for basic website functionality and cannot be disabled. These include session management and security features."
        },
        {
          subtitle: "Analytics Cookies",
          text: "Help us understand how visitors interact with our website, allowing us to improve content and user experience."
        },
        {
          subtitle: "Marketing Cookies",
          text: "Used to deliver relevant advertisements and track campaign performance. These are optional and require your consent."
        },
        {
          subtitle: "Third-Party Cookies",
          text: "Some third-party services (like social media platforms) may set their own cookies. We recommend reviewing their privacy policies."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Third-Party Services",
      content: [
        {
          subtitle: "Analytics Providers",
          text: "We use services like Google Analytics to understand user behavior and improve our content. These providers have their own privacy policies."
        },
        {
          subtitle: "Email Marketing",
          text: "We use email service providers to manage our newsletter and communications. Your email address is stored securely with these providers."
        },
        {
          subtitle: "Social Media",
          text: "Our website includes social media features that may collect your IP address and set cookies. Your interactions are governed by the respective platform's privacy policy."
        },
        {
          subtitle: "Advertising Partners",
          text: "We may work with advertising partners to display relevant ads. These partners may use cookies and similar technologies."
        }
      ]
    },
    {
      icon: Eye,
      title: "Children's Privacy",
      content: [
        {
          text: "Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately."
        }
      ]
    },
    {
      icon: Mail,
      title: "Contact Information",
      content: [
        {
          text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:"
        },
        {
          text: "Email: privacy@wealthymiles.com",
          bold: true
        },
        {
          text: "We typically respond to privacy-related inquiries within 3-5 business days."
        }
      ]
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
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how WealthyMiles collects, 
            uses, and protects your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            At WealthyMiles, we are committed to protecting your privacy and being transparent 
            about how we handle your personal information. This Privacy Policy applies to all 
            information collected through our website, mobile applications, and related services.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            By using our services, you agree to the collection and use of information in 
            accordance with this policy. We encourage you to read this policy carefully to 
            understand our practices.
          </p>
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
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-blue-200 pl-6 py-1">
                      {item.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h3>
                      )}
                      <p className={`text-gray-700 leading-relaxed ${item.bold ? 'font-medium' : ''}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Policy Updates */}
        <motion.div 
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-yellow-600 mr-3" />
            Policy Updates
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our 
            practices or legal requirements. We will notify you of any material changes by 
            posting the updated policy on our website and updating the "Last updated" date. 
            We encourage you to review this policy periodically.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Continued use of our services after any changes constitutes your acceptance of 
            the updated Privacy Policy.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Privacy Choices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">
                Have questions about your data? Reach out to our privacy team.
              </p>
            </div>
            <div className="p-4">
              <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Manage Preferences</h3>
              <p className="text-sm text-gray-600">
                Update your communication preferences and data settings.
              </p>
            </div>
            <div className="p-4">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Download Data</h3>
              <p className="text-sm text-gray-600">
                Request a copy of your personal information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          className="text-center mt-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-sm">
            Thank you for trusting WealthyMiles with your information. We are committed to 
            protecting your privacy while helping you achieve financial freedom through travel.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;