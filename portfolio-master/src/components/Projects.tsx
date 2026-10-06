import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      id: "cloud-honeypot-analysis",
      title: "Comparative Cloud Honeypot Analysis",
      description: "Enterprise-grade honeypot system for threat intelligence and attack pattern analysis comparing GCP vs Azure deployments.",
      longDescription: "Comprehensive honeypot deployment capturing and analyzing malicious activities in real-time. Implemented multiple honeypot services including Cowrie, Dionaea, and Glastopf to attract different types of attacks.",
      technologies: ["T-POT", "Docker", "ELK Stack", "GCP", "Azure", "Threat Intelligence"],
      githubUrl: "https://github.com/Linathimqalo/cloud-honeypot-analysis",
      category: "Cybersecurity",
      featured: true
    },
    {
      id: "zeus-malware-analysis",
      title: "Zeus Banking Trojan",
      description: "Deep dive malware analysis of Zeus banking trojan using static and dynamic analysis techniques.",
      longDescription: "Comprehensive analysis of Zeus malware samples including behavior analysis, code reverse engineering, and IOC extraction for threat hunting purposes.",
      technologies: ["Malware Analysis", "IDA Pro", "OllyDbg", "Wireshark", "Virtual Machines", "YARA Rules"],
      githubUrl: "https://github.com/Linathimqalo/Malware-Analysis",
      category: "Security Research",
      featured: true
    },
    {
      id: "luxury-portfolio-app",
      title: "Luxury Portfolio Web Application",
      description: "A premium personal portfolio platform with blog, projects, certifications, and customizable themes powered by Supabase and Next.js.",
      longDescription: "Designed and built a full-stack portfolio platform inspired by Apple, Tesla, and Medium aesthetics. Implemented Supabase backend with authentication, RLS policies, and storage buckets for user-generated content. Delivered CRUD functionality for projects, docs, blog posts, and certifications. Added dark/light modes, customizable color themes, and a sleek premium UI with advanced typography and spacing. The result is a production-ready portfolio app with a modern, elegant user experience.",
      technologies: ["Next.js", "TypeScript", "Supabase", "TailwindCSS", "ShadCN UI", "Framer Motion"],
      githubUrl: "https://github.com/Linathimqalo/velvet-ink-forge",
      liveUrl: "https://aureum-omega.vercel.app/",
      category: "Full-Stack Development",
      featured: true
    },
    {
      id: "siem-soc-lab",
      title: "SIEM/SOC Lab Environment",
      description: "Complete Security Operations Center laboratory setup with multiple SIEM platforms and security tools.",
      longDescription: "Built comprehensive SOC environment with Wazuh, Splunk, Security Onion, and TheHive5 for security monitoring, incident response, and threat hunting capabilities.",
      technologies: ["Wazuh", "Splunk", "Security Onion", "TheHive5", "MISP", "Suricata", "Elasticsearch"],
      githubUrl: "#",
      category: "Infrastructure",
      featured: false
    },
    {
      id: "sharepoint-migration",
      title: "SharePoint Migration Project",
      description: "Enterprise SharePoint migration improving team collaboration and productivity across multiple departments.",
      longDescription: "Led migration of legacy file systems to modern SharePoint Online environment, improving collaboration efficiency by 60% and reducing data silos.",
      technologies: ["SharePoint", "Office 365", "PowerShell", "Migration Tools", "Azure AD"],
      githubUrl: "#",
      category: "Enterprise",
      featured: false
    },
    {
      id: "personal-finance-app",
      title: "Personal Finance Management Platform",
      description: "A full-stack finance app for tracking budgets, transactions, goals, debts, and investments with real-time reporting and insights.",
      longDescription: "Built a comprehensive personal finance management platform using Supabase and Lovable AI. The application features secure authentication, row-level security policies, and multi-currency support. Users can manage transactions, budgets, financial goals, debts, and investments with full CRUD functionality. Added a dynamic dashboard with real-time insights, interactive reports, and customizable user settings. Integrated investment tracking with live asset pricing APIs and designed a responsive, modern UI with TailwindCSS and glassmorphism effects.",
      technologies: ["React", "TypeScript", "Supabase", "TailwindCSS", "Lovable", "PostgreSQL", "REST APIs"],
      githubUrl: "https://github.com/Linathimqalo/lumin-wealth",
      liveUrl: "https://finora-gold.vercel.app/",
      category: "Finance",    
      featured: true
    },
    {
      id: "deloitte-simulation",
      title: "Deloitte Cybersecurity Simulation",
      description: "Cybersecurity job simulation focusing on breach analysis and incident response reporting.",
      longDescription: "Participated in comprehensive cybersecurity simulation involving breach detection, forensic analysis, and detailed incident response documentation following industry best practices.",
      technologies: ["Incident Response", "Forensic Analysis", "NIST Framework", "Risk Assessment", "Reporting"],
      githubUrl: "#",
      liveUrl: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_z7MYArvHSWyZGuezg_1750605608939_completion_certificate.pdf",
      category: "Professional Development",
      featured: false
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 lg:py-32 bg-gradient-luxury">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6">
              Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="font-open-sans text-muted-foreground text-lg max-w-2xl mx-auto">
              Showcasing innovative solutions in cybersecurity, system administration, and software development
            </p>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            variants={containerVariants}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="card-elegant hover-luxury group relative overflow-hidden"
              >
                {/* Featured Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-primary text-white border-0 shadow-glow">
                    Featured
                  </Badge>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {project.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-poppins font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="font-open-sans text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted/50 text-muted-foreground rounded-lg text-xs font-open-sans"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-muted/50 text-muted-foreground rounded-lg text-xs font-open-sans">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {project.githubUrl !== "#" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl border-primary/20 hover:border-primary/40 flex-1"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    className="bg-gradient-primary text-white rounded-2xl flex-1 hover:shadow-glow"
                    asChild
                  >
                    <Link to={`/projects/${project.id}`}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  {project.liveUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          {/* Other Projects */}
          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-2xl text-foreground mb-8 text-center">
              Other Projects
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="card-elegant hover-luxury p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className="border-secondary/20 text-secondary mb-2">
                        {project.category}
                      </Badge>
                      <h4 className="font-poppins font-semibold text-lg text-foreground">
                        {project.title}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl !== "#" && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="font-open-sans text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted/30 text-muted-foreground rounded text-xs font-open-sans"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="card-elegant bg-gradient-luxury max-w-2xl mx-auto">
              <h3 className="font-poppins font-semibold text-2xl text-foreground mb-4">
                Interested in Collaborating?
              </h3>
              <p className="font-open-sans text-muted-foreground mb-6">
                I'm always excited to work on new projects and tackle challenging problems in cybersecurity and technology.
              </p>
              <Button
                size="lg"
                className="bg-gradient-primary text-white rounded-3xl hover:shadow-luxury"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's Work Together
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
