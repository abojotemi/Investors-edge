"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  HelpCircle,
  Building,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import Link from "next/link";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    value: "hello@investorsedge.com",
    action: "mailto:hello@investorsedge.com",
  },
  // {
  //   icon: MessageSquare,
  //   title: "Live Chat",
  //   description: "Chat with our team during business hours",
  //   value: "Available 9am - 6pm EST",
  //   action: "#",
  // },
  // {
  //   icon: Phone,
  //   title: "Call Us",
  //   description: "Speak directly with our support team",
  //   value: "+1 (555) 123-4567",
  //   action: "tel:+15551234567",
  // },
];

const faqs = [
  {
    question: "How do I get started with Investor's Edge?",
    answer:
      "Simply create a free account and complete our quick assessment. We'll personalize your experience based on your goals and experience level.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use bank-level encryption and never share your personal data with third parties. Your security is our top priority.",
  },
  {
    question: "Do you provide actual investment advice?",
    answer:
      "We provide educational content and tools to help you make informed decisions. For personalized investment advice, we recommend consulting with a licensed financial advisor.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes, you can cancel your membership at any time with no penalties. We believe in earning your trust, not locking you in.",
  },
];

const departments = [
  { icon: HelpCircle, label: "General Inquiry", value: "general" },
  { icon: Users, label: "Partnerships", value: "partnerships" },
  { icon: Building, label: "Media & Press", value: "media" },
  { icon: MessageSquare, label: "Technical Support", value: "support" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "general",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full mb-6">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-primary-green">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions, feedback, or want to partner with us? We&apos;d love
            to hear from you.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-green transition-all">
                  <Icon className="w-6 h-6 text-primary-green group-hover:text-white transition-all" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {method.description}
                </p>
                <p className="text-primary-green font-medium">{method.value}</p>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    We&apos;ve received your message and will get back to you
                    within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-primary-green text-primary-green hover:bg-primary-green/10"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all bg-white"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-green hover:bg-primary-green/90 text-white py-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            {/* Office Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 bg-gradient-to-br from-primary-green to-primary-green/80 rounded-2xl p-6 text-white"
            >
              <h3 className="font-semibold mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Monday - Friday: 9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Finance Street, New York, NY 10001</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Need Help Faster?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Check out our community forum where you can get answers from
            experienced investors and our team members.
          </p>
          <Link href="/community/forum">
            <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8">
              <MessageSquare className="w-4 h-4 mr-2" />
              Visit Community Forum
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
