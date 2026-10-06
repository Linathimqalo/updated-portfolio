import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  detailedDescription?: string;
  achievements?: string[];
  technologies?: string[];
}

const Experience: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const experiences: ExperienceItem[] = [
    {
      id: "bemysocial",
      title: "Systems Administrator",
      company: "BeMySocial",
      period: "Feb 2024 – Present",
      location: "Remote, United Kingdom",
      highlights: [
        "Managing infrastructure for 100+ client websites with 99.9% uptime",
        "Implementing cybersecurity protocols reducing security incidents by 75%",
        "Led a team of 5 technical specialists in infrastructure optimization",
        "Automated backup and recovery processes improving efficiency by 60%"
      ],
      detailedDescription: "Leading comprehensive IT infrastructure management for a growing digital agency serving 100+ clients. Responsible for maintaining high availability, implementing security best practices, and ensuring optimal performance across diverse web environments.",
      achievements: [
        "Reduced average incident response time from 4 hours to 45 minutes",
        "Implemented proactive monitoring system detecting 95% of issues before client impact",
        "Designed disaster recovery procedures tested monthly with 100% success rate",
        "Mentored junior administrators resulting in 40% improvement in team efficiency"
      ],
      technologies: ["Linux", "Windows Server", "Docker", "Kubernetes", "Monitoring Tools", "Security Frameworks"]
    },
    {
      id: "itsolutions",
      title: "IT Support Technician",
      company: "IT Solutions",
      period: "Apr 2023 – Jan 2024",
      location: "Grahamstown, South Africa",
      highlights: [
        "Provided technical support for 200+ end-users across multiple departments",
        "Configured and maintained network infrastructure and security systems",
        "Reduced ticket resolution time by 40% through process optimization",
        "Implemented user training programs improving security awareness by 65%"
      ],
      detailedDescription: "Delivered comprehensive IT support services in a fast-paced environment, focusing on user experience, system reliability, and security compliance. Worked closely with various departments to understand business needs and provide tailored technical solutions.",
      achievements: [
        "Maintained 98% customer satisfaction rating across all support interactions",
        "Successfully migrated 50+ users to cloud-based productivity suite with zero downtime",
        "Developed internal documentation reducing onboarding time for new technicians by 50%",
        "Lead a team to deploy centralised IT monitoring and endpoint management across 12 branches for 100+ employees."
      ],
      technologies: ["Active Directory", "Office 365", "Network Configuration", "Help Desk Systems", "VPN Setup"]
    },
    {
      id: "freelance",
      title: "Freelance Web Developer",
      company: "Independent",
      period: "2021 – 2022",
      location: "Remote",
      highlights: [
        "Developed 15+ responsive websites for small businesses and startups",
        "Specialized in modern web technologies and user experience design",
        "Managed full project lifecycle from requirements to deployment",
        "Built long-term relationships with clients resulting in 80% repeat business"
      ],
      detailedDescription: "Provided end-to-end web development services for diverse clients, focusing on creating modern, responsive, and user-friendly websites that drive business growth. Specialized in translating business requirements into technical solutions.",
      achievements: [
        "Delivered all projects on time and within budget constraints",
        "Increased client website performance by average of 60% through optimization",
        "Implemented SEO best practices resulting in 40% improvement in search rankings",
        "Created reusable component libraries reducing development time by 30%"
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "WordPress", "Responsive Design"]
    },
    {
      id: "damelin",
      title: "LAN Admin Intern",
      company: "Damelin",
      period: "2020",
      location: "East London, South Africa",
      highlights: [
        "Assisted in network administration and maintenance for educational facility",
        "Gained hands-on experience with enterprise networking equipment",
        "Supported IT infrastructure serving 500+ students and staff",
        "Participated in security audits and compliance assessments"
      ],
      detailedDescription: "Gained foundational experience in enterprise IT environment, learning industry best practices for network administration, security protocols, and user support in an educational setting.",
      achievements: [
        "Successfully completed comprehensive network security training program",
        "Contributed to network upgrade project improving campus connectivity by 50%",
        "Documented network configurations and procedures for future reference",
        "Received commendation for proactive approach to problem-solving"
      ],
      technologies: ["Network Administration", "Windows Server", "Cisco Equipment", "Security Protocols"]
    }
  ];

  const toggleExpansion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="experience" className="py-20 lg:py-32 bg-gradient-luxury">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6">
              Professional <span className="bg-gradient-primary bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="font-open-sans text-muted-foreground text-lg">
              A journey of growth, innovation, and technical excellence
            </p>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary opacity-30" />

            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 bg-gradient-primary rounded-full border-4 border-background shadow-glow" />

                  {/* Content Card */}
                  <div className="ml-20 card-elegant hover-luxury">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h3 className="font-poppins font-semibold text-xl lg:text-2xl text-foreground mb-2">
                          {experience.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-muted-foreground">
                          <span className="font-medium text-primary">{experience.company}</span>
                          <span className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {experience.period}
                          </span>
                          <span className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {experience.location}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpansion(experience.id)}
                        className="mt-4 lg:mt-0 rounded-2xl border-primary/20 hover:border-primary/40"
                      >
                        View More
                        <motion.div
                          animate={{ rotate: expandedItem === experience.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </Button>
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-3">
                      {experience.highlights.map((highlight, highlightIndex) => (
                        <motion.div
                          key={highlightIndex}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: highlightIndex * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <p className="font-open-sans text-muted-foreground">{highlight}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedItem === experience.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mt-6 pt-6 border-t border-border/20 overflow-hidden"
                        >
                          <div className="space-y-6">
                            {experience.detailedDescription && (
                              <div>
                                <h4 className="font-poppins font-semibold text-lg text-foreground mb-3">
                                  Role Overview
                                </h4>
                                <p className="font-open-sans text-muted-foreground leading-relaxed">
                                  {experience.detailedDescription}
                                </p>
                              </div>
                            )}

                            {experience.achievements && (
                              <div>
                                <h4 className="font-poppins font-semibold text-lg text-foreground mb-3">
                                  Key Achievements
                                </h4>
                                <div className="space-y-2">
                                  {experience.achievements.map((achievement, achievementIndex) => (
                                    <div key={achievementIndex} className="flex items-start">
                                      <ExternalLink className="w-4 h-4 text-primary mt-1 mr-3 flex-shrink-0" />
                                      <p className="font-open-sans text-muted-foreground text-sm">
                                        {achievement}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {experience.technologies && (
                              <div>
                                <h4 className="font-poppins font-semibold text-lg text-foreground mb-3">
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {experience.technologies.map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-sm font-open-sans"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;