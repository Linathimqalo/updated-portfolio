import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Code, Users } from 'lucide-react';
import linathi from './../assets/linathi.jpg';

const About: React.FC = () => {
  const highlights = [
    {
      icon: Shield,
      title: "Cybersecurity Expert",
      description: "Specialized in threat detection, incident response, and security architecture"
    },
    {
      icon: Server,
      title: "Infrastructure Management", 
      description: "Managing 100+ websites with focus on performance and security"
    },
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "Building modern web applications with cutting-edge technologies"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Leading technical teams and streamlining operational processes"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-luxury">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Profile Image Placeholder */}
            <motion.div variants={itemVariants} className="lg:order-1">
              <div className="relative">
                <div className="w-full max-w-md mx-auto aspect-square rounded-3xl bg-gradient-luxury border border-border/20 flex items-center justify-center shadow-elegant hover-luxury">
                  <div className="text-muted-foreground text-center">
                    <div className="w-full h-full mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <img src={linathi} className="rounded-full text-primary" />
                    </div>
                    <p className="font-open-sans">Linathi Mqalo</p>
                  </div>
                </div>
                {/* Floating accent elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-primary rounded-2xl opacity-20 rotate-45" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary rounded-xl opacity-30 rotate-12" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants} className="lg:order-2">
              <div className="space-y-6">
                <h3 className="font-poppins font-semibold text-2xl lg:text-3xl text-foreground">
                  Passionate About <span className="text-primary">Secure Innovation</span>
                </h3>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-open-sans text-muted-foreground leading-relaxed">
                    Detail-oriented professional with <strong className="text-primary">3+ years</strong> managing IT infrastructure 
                    for 100+ websites and supporting end-users, emphasizing cybersecurity principles to enhance 
                    performance, reduce risks, and ensure compliance.
                  </p>
                  
                  <p className="font-open-sans text-muted-foreground leading-relaxed">
                    Skilled in server management, threat detection, and incident response across on-premises 
                    and cloud environments. Proven in leading teams, streamlining operations, and minimizing 
                    downtime while supporting innovation.
                  </p>
                </div>

                {/* Highlight Stats */}
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center p-4 rounded-2xl bg-card border border-border/20">
                    <div className="font-bold text-2xl text-primary font-montserrat">100+</div>
                    <div className="text-sm text-muted-foreground font-open-sans">Websites Managed</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-card border border-border/20">
                    <div className="font-bold text-2xl text-primary font-montserrat">3+</div>
                    <div className="text-sm text-muted-foreground font-open-sans">Years Experience</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Highlights Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                className="card-elegant hover-luxury text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary/10 flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <highlight.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-poppins font-semibold text-lg mb-2 text-foreground">
                  {highlight.title}
                </h4>
                <p className="font-open-sans text-muted-foreground text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;