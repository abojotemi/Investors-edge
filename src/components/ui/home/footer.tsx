"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Security", href: "#" },
        { label: "Integrations", href: "#" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "Webinars", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Help Center", href: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Disclaimer", href: "#" },
      ],
    },
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <footer className="min-h-screen flex flex-col justify-center bg-foreground text-background relative overflow-hidden">
      {/* Decorative top border - three colored sections */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 bg-primary-green origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 bg-primary-orange origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex-1 bg-primary-peach origin-left"
        />
      </div>
      
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-green/10 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-orange/8 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary-peach/10 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-primary-green/15 rounded-full" />
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary-orange/12 rounded-full" />
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary-peach/15 rounded-full" />
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-3 lg:col-span-2 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Investor's Edge"
                  width={150}
                  height={40}
                  className="h-10 w-auto invert"
                />
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-background/70 leading-relaxed max-w-sm"
            >
              Empowering investors with cutting-edge tools and insights for
              smarter investment decisions.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 text-sm text-background/70"
            >
              {[
                {
                  icon: <Mail className="w-4 h-4 text-primary-orange" />,
                  text: "support@investorsedge.com",
                },
                {
                  icon: <Phone className="w-4 h-4 text-primary-orange" />,
                  text: "+234 90 2507 5771",
                },
                {
                  icon: (
                    <MapPin className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />
                  ),
                  text: "123 Financial District, Lagos, Nigeria",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-3"
            >
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary-green hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              custom={sectionIndex}
              className="space-y-4"
            >
              <motion.h4
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + sectionIndex * 0.1 }}
                className="font-semibold text-background"
              >
                {section.title}
              </motion.h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05,
                    }}
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        className="text-background/70 hover:text-primary-orange transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="border-t border-background/10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="text-sm text-background/60"
            >
              © {new Date().getFullYear()} Investor&apos;s Edge. All rights
              reserved.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="flex items-center gap-6 text-xs text-background/60"
            >
              {["256-bit SSL Encryption", "SOC 2 Compliant", "GDPR Ready"].map(
                (badge, index) => (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: index * 0.3,
                      }}
                      className="w-2 h-2 bg-primary-green rounded-full"
                    />
                    {badge}
                  </motion.span>
                )
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
