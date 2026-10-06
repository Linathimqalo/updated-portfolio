import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-luxury border-t border-border/20">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          {/* Logo/Name */}
          <div>
            <h3 className="font-montserrat font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
              Linathi Mqalo
            </h3>
            <p className="font-open-sans text-muted-foreground">
              Systems Administrator | Web Developer | Cybersecurity Analyst
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { label: 'About', href: '#about' },
              { label: 'Skills', href: '#skills' },
              { label: 'Experience', href: '#experience' },
              { label: 'Projects', href: '#projects' },
              { label: 'Contact', href: '#contact' }
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                className="font-open-sans text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-md mx-auto h-px bg-gradient-primary opacity-30" />

          {/* Copyright and Credits */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center font-open-sans text-muted-foreground">
              <span>© {currentYear} Linathi Mqalo. Built with</span>
              <Heart className="w-4 h-4 mx-2 text-red-500 fill-current" />
              <span>and cutting-edge technology</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="rounded-2xl hover:bg-primary/10 hover:text-primary"
            >
              Back to top
              <ArrowUp className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-open-sans text-xs text-muted-foreground/70 italic">
              "Building secure, scalable, and modern solutions"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;