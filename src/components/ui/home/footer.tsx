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

const Footer = () => {
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Security", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "API", href: "#" },
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
        { label: "Press", href: "#" },
        { label: "Partners", href: "#" },
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

  return (
    <footer className="bg-gradient-to-b from-foreground to-[#1a1a1a] text-background relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-green via-primary-orange to-primary-peach" />
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.jpg"
                alt="Investor's Edge"
                width={150}
                height={40}
                className="h-10 w-auto invert"
              />
            </Link>
            <p className="text-background/70 leading-relaxed max-w-sm">
              Empowering investors with cutting-edge tools and insights for
              smarter investment decisions.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-orange" />
                <span>support@investorsedge.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-orange" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />
                <span>123 Financial District, New York, NY 10004</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary-green hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-background">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-background/70 hover:text-primary-orange transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} Investor&apos;s Edge. All rights
              reserved.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-xs text-background/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-green rounded-full" />
                256-bit SSL Encryption
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-green rounded-full" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-green rounded-full" />
                GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
