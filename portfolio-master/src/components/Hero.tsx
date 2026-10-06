import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import GalaxyBackground from './GalaxyBackground';

const Hero: React.FC = () => {
  const { theme } = useTheme();

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {theme === 'dark' && <GalaxyBackground />}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <h1 className="font-montserrat font-bold text-5xl md:text-7xl lg:text-8xl mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Linathi Mqalo
            </span>
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="space-y-2 text-xl md:text-2xl lg:text-3xl font-poppins font-medium">
            <span className="text-primary">Systems Administrator</span>
            <span className="text-muted-foreground"> | </span>
            <span className="text-primary">Web Developer</span>
            <span className="text-muted-foreground"> | </span>
            <span className="text-primary">Cybersecurity Analyst</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-open-sans">
            Building secure, scalable, and modern solutions through innovative technology
            and cybersecurity expertise
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="bg-gradient-primary hover:shadow-luxury text-white font-medium px-8 py-4 rounded-3xl text-lg transition-all duration-300 hover:scale-105"
          >
            View My Work
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;