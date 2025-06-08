import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MapPin, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const faqs = [
  {
    question: "How do I report a civic issue?",
    answer: "Click the 'Report Issue' button on your dashboard, select the issue type, provide a detailed description, and pin the location on the map. Your report will be submitted to local administrators for review."
  },
  {
    question: "How can I track the status of my reported issues?",
    answer: "Go to your Citizen Dashboard and navigate to the 'My Reports' tab. Here you can see all your submitted issues with their current status: Pending, In Progress, or Resolved."
  },
  {
    question: "What does upvoting an issue do?",
    answer: "Upvoting helps prioritize community issues. Issues with more upvotes get higher visibility and may be addressed more quickly by administrators."
  },
  {
    question: "How do I register for volunteer events?",
    answer: "Visit the Events page, browse available opportunities, and click 'Register as Volunteer' on events that interest you. Some events have limited slots, so register early!"
  },
  {
    question: "Can I participate in community discussions?",
    answer: "Yes! Use the Community Chat feature on your dashboard to engage with fellow citizens and local administrators about civic matters."
  },
  {
    question: "How long does it take for issues to be resolved?",
    answer: "Resolution time varies depending on the issue type and complexity. Simple issues like streetlight repairs may be resolved within days, while complex infrastructure issues may take weeks or months."
  },
  {
    question: "What information should I include when reporting an issue?",
    answer: "Provide as much detail as possible: clear description, exact location (use the map), photos if relevant, and any safety concerns. This helps administrators understand and address the issue effectively."
  },
  {
    question: "How do I contact administrators directly?",
    answer: "Use the contact form below, participate in community chat, or attend public meetings listed in the Events calendar. For urgent safety issues, contact emergency services directly."
  }
];

export default function HelpContact() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Thank you for your message! We will get back to you soon.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions or get in touch with our team
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-2">Get help via email</p>
            <a href="mailto:support@civicsync.com" className="text-blue-600 hover:text-blue-700 font-medium">
              support@civicsync.com
            </a>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-2">Call us during business hours</p>
            <a href="tel:+1234567890" className="text-green-600 hover:text-green-700 font-medium">
              (123) 456-7890
            </a>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-2">City Hall, Room 205</p>
            <p className="text-purple-600 font-medium">
              123 Main Street<br />
              Anytown, ST 12345
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
              <HelpCircle className="w-7 h-7 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              <span>Send us a Message</span>
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  {...register('subject', { required: true })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What is your message about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { required: true })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please describe your question or concern in detail..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Getting Started with CivicSync</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Your Account</h3>
              <p className="text-gray-600 text-sm">
                Sign up as a citizen to start reporting issues and participating in your community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Report & Track Issues</h3>
              <p className="text-gray-600 text-sm">
                Use the dashboard to report civic problems and track their resolution status.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Engage & Volunteer</h3>
              <p className="text-gray-600 text-sm">
                Join community events, volunteer for local initiatives, and participate in discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}