"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="relative min-h-screen flex items-center py-16 lg:py-24 overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 0.3 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary-green/10 rounded-full blur-3xl"
        />
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 0.2 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
           className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-primary-orange/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4 z-10 w-full flex flex-col items-center">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green/10 text-primary-green dark:text-primary-green/90 rounded-full text-sm font-semibold border border-primary-green/20"
          >
            <Mail className="w-4 h-4" />
            <span>Stay Updated</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">
              Community
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Don't miss out on important updates. Subscribe to our newsletter down below to get the latest insights and opportunities straight to your inbox.
          </motion.p>
        </div>

        {/* Embedded Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex justify-center py-8"
        >
          <iframe
            width="100%"
            height="700"
            src="https://c6557e70.sibforms.com/serve/MUIFAHU8mpc6m9tWCYvFhyfQFFvsCs3cnz7Iywh0D-uGsFnwZiQK2wYu9iNQtNPbD7Y50OFdqDl4QEvfMedmW1CUmPHpYlVt5B9_TNEoCJHNn3jmnrT3zr6vMIzmddc2Vhp31cEuf3m1NeN7jig_ZqrJu8DNPVfeTJ34UZbdwnSC4Z2_borpagVFzuZyJMY_fM3gmt7khTLo9CD43Q=="
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "100%",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
