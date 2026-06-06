import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Server, Activity, Award, Mail, Phone, 
  MapPin, ExternalLink, GraduationCap, Terminal, ArrowUp, 
  CheckCircle, Globe, Cpu, Menu, X, ArrowRight, Sun, Moon
} from 'lucide-react';
import { educationList, projectList, certificationList, timelineList } from './data';
import { Project, Certification } from './types';
import { InteractiveModal } from './components/InteractiveModal';

export default function App() {
  // Global States
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [typedText, setTypedText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'certification'>('project');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floating Particles
  const [particles, setParticles] = useState<any[]>([]);

  // Local clock state for UTC
  const [utcTime, setUtcTime] = useState('');

  // Profile image state with localStorage persistence
  const [profileImg] = useState<string>(() => {
    return localStorage.getItem('cyber_profile_img') || 'https://github.com/devendra-verma-00.png';
  });

  // Typing effect
  const phrases = [
    'Cyber Security Engineer & Student',
    'Penetration Testing Specialist',
    'Network Defense Analyst',
    'Secure Application Programmer'
  ];
  
  useEffect(() => {
    let pi = 0;
    let ci = 0;
    let del = false;
    let timer: any;

    const type = () => {
      const phrase = phrases[pi];
      if (!del) {
        if (ci <= phrase.length) {
          setTypedText(phrase.slice(0, ci));
          ci++;
          timer = setTimeout(type, 60);
        } else {
          del = true;
          timer = setTimeout(type, 1600);
        }
      } else {
        if (ci > 0) {
          setTypedText(phrase.slice(0, ci));
          ci--;
          timer = setTimeout(type, 30);
        } else {
          del = false;
          pi = (pi + 1) % phrases.length;
          timer = setTimeout(type, 300);
        }
      }
    };
    
    type();
    return () => clearTimeout(timer);
  }, []);

  // Set UTC clock and Particles
  useEffect(() => {
    // Clock
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Particles array generator
    const list = Array.from({ length: 40 }, () => ({
      id: Math.random().toString(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(list);

    // Scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Determine active nav link
      const sections = ['hero', 'about', 'education', 'skills', 'experience', 'projects', 'certifications', 'achievements', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Theme synchronization effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const handleOpenProject = (proj: Project) => {
    setSelectedProject(proj);
    setModalType('project');
    setIsModalOpen(true);
  };

  const handleOpenCert = (cert: Certification) => {
    setSelectedCert(cert);
    setModalType('certification');
    setIsModalOpen(true);
  };

  const handleSubmitMail = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus({ type: 'error', msg: '⚠ Please fill in Name, Email and Message.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormStatus({ type: 'error', msg: '⚠ Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: null, msg: '' });

    try {
      const response = await fetch('https://formsubmit.co/ajax/devendraverma89624@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          _subject: subject || 'Portfolio Connection Request',
          message,
          _captcha: 'false' // Disables the iframe redirect captcha
        })
      });

      const data = await response.json();

      if (response.ok && data.success === 'true') {
        setFormStatus({
          type: 'success',
          msg: '📨 Message transmitted successfully! Thank you for reaching out.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || `Status code ${response.status}`);
      }
    } catch (error) {
      console.warn('Direct submit failed, trying fallback:', error);
      
      // Attempt backup dispatch using mailto link
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const subj = encodeURIComponent(subject || 'Portfolio Connection Request');
      const mailtoLink = `mailto:devendraverma89624@gmail.com?subject=${subj}&body=${body}`;

      try {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setFormStatus({
          type: 'success',
          msg: '📨 Direct network request bypassed. Mail client triggered to complete the transmission!'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (triggerError) {
        setFormStatus({
          type: 'error',
          msg: '⚠️ Could not transmit automatically. Please directly email devendraverma89624@gmail.com'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text selection:bg-cyber-cyan selection:text-black">
      
      {/* Scroll indicator */}
      <div className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-100" style={{ width: '100%' }} id="scroll-bar-indicator" />

      {/* Background Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyber-cyan animate-pulse"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Cyber Header Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-cyber-bg/95 backdrop-blur-md border-b border-cyber-border h-16 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif italic text-cyber-cyan flex items-center gap-2 duration-200 hover:scale-[1.03]">
            <Shield className="w-5 h-5 text-cyber-cyan" />
            DV.Sec
          </span>
        </div>

        {/* Desktop Menus & Controls */}
        <div className="flex items-center gap-4">
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-[11px] tracking-widest text-[#9CA3AF]">
            {['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'].map((sec) => (
              <li key={sec}>
                <a 
                  href={`#${sec}`}
                  className={`transition-all py-1 border-b-2 hover:text-cyber-cyan uppercase ${activeSection === sec ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent'}`}
                >
                  {sec === 'hero' ? 'home' : (sec === 'certifications' ? 'certificates' : (sec === 'experience' ? 'workshop & training' : sec))}
                </a>
              </li>
            ))}
          </ul>

          {/* Theme Option (Light / Dark) */}
          <button 
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-cyber-border rounded-lg hover:border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-bg/50 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-cyber-cyan" /> : <Moon className="w-4 h-4 text-cyber-cyan" />}
          </button>

          {/* Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 border border-cyber-border rounded hover:border-cyber-cyan/50 text-cyber-cyan cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-cyber-bg border-b border-cyber-border z-30 flex flex-col p-4 md:hidden font-mono text-sm gap-3 shrink-0">
          {['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'].map((sec) => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded text-center uppercase tracking-widest hover:bg-cyber-cyan/10 hover:text-cyber-cyan ${activeSection === sec ? 'text-cyber-cyan bg-cyber-cyan/5' : 'text-gray-400'}`}
            >
              {sec === 'hero' ? 'HOME' : (sec === 'certifications' ? 'CERTIFICATES' : (sec === 'experience' ? 'WORKSHOP & TRAINING' : sec))}
            </a>
          ))}
          {/* Mobile Theme Toggle */}
          <button 
            onClick={() => {
              setTheme(prev => prev === 'dark' ? 'light' : 'dark');
              setMobileMenuOpen(false);
            }}
            className="mt-2 p-2.5 border border-cyber-border rounded text-center uppercase tracking-widest text-cyber-muted hover:text-cyber-cyan hover:bg-cyber-cyan/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-cyber-cyan" /> Switch to Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyber-cyan" /> Switch to Dark Mode
              </>
            )}
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-24 md:space-y-36 pt-16">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative py-12">
          {/* Metadata Overlay Bar */}
          <div className="absolute top-8 right-0 hidden lg:flex items-center gap-4 text-xs font-mono text-cyber-muted bg-cyber-card/50 border border-cyber-border rounded-lg p-2 px-3">
            <span className="flex items-center gap-1"><Cpu className="w-4 h-4 text-cyber-cyan" /> SYS_CLOCK: {utcTime}</span>
            <span>|</span>
            <span className="text-cyber-cyan">● GATEWAY SECURE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left bio card */}
            <div className="lg:col-span-8 space-y-6">
              <span className="font-mono text-cyber-cyan uppercase tracking-[0.2em] text-xs">
                PORTFOLIO PROFILE
              </span>
              
              <h1 className="font-serif italic font-light text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight">
                Devendra<br />
                <span className="text-gradient">Verma</span>
              </h1>

              {/* Sub-heading typed text */}
              <div className="font-mono text-cyber-cyan text-sm sm:text-lg lg:text-xl border-l-2 border-cyber-cyan pl-3 flex items-center">
                <span>{typedText}</span>
                <span className="animate-ping ml-1">_</span>
              </div>

              <p className="text-cyber-muted text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Cybersecurity student and secure software architect possessing hands-on proficiency in Unix architectures, network traffic analysis, modular penetration testing, and secure web pipelines. Committed to engineering active and defensive systems that guard critical infrastructure.
              </p>

              {/* Contact Button Bar */}
              <div className="flex flex-wrap gap-4 items-center">
                <a 
                  href="#contact" 
                  className="px-6 py-2.5 bg-cyber-cyan hover:bg-[#b59049] text-black text-xs font-bold tracking-widest font-mono uppercase transition-all duration-300 shadow-lg shadow-cyber-cyan/10"
                >
                  📧 Contact Me
                </a>
                <a 
                  href="https://github.com/devendra-verma-00" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-cyber-border text-cyber-text hover:border-cyber-cyan hover:text-cyber-cyan text-xs font-bold tracking-widest font-mono uppercase transition-all duration-300"
                >
                  ⌥ GitHub Repo
                </a>
                <a 
                  href="https://www.linkedin.com/in/devendra-verma-573509309" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-cyber-border text-cyber-text hover:border-cyber-cyan hover:text-cyber-cyan text-xs font-bold tracking-widest font-mono uppercase transition-all duration-300"
                >
                  🔗 LinkedIn
                </a>
              </div>
            </div>

            {/* Right scanner graphical profile layout */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-64 h-64 sm:w-72 sm:h-72 border border-cyber-border relative rounded overflow-hidden shadow-2xl shrink-0 group transition-all duration-300">
                {/* Horizontal scanner bar effect */}
                <div className="absolute inset-x-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent top-0 animate-[scan_4s_linear_infinite] opacity-50 z-10 pointer-events-none" />
                
                {/* Image itself */}
                <img 
                  src={profileImg} 
                  alt="Devendra Verma Cyber security profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-90 border-2 border-cyber-border/40 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                />

                {/* Secure Tech Framing corners */}
                <span className="absolute top-2 left-2 text-[10px] text-cyber-cyan font-mono tracking-widest bg-cyber-bg/70 px-1 py-0.5 rounded border border-cyber-cyan/20 z-10 pointer-events-none">DV.00</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-cyber-purple font-mono tracking-widest bg-cyber-bg/70 px-1 py-0.5 rounded border border-cyber-purple/20 z-10 pointer-events-none">OP.SEC</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT & STATS SECTION */}
        <section id="about" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">About Me</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-cyber-gray leading-relaxed text-sm sm:text-base">
              <p>
                I am currently pursuing B.Tech in Cyber Security at SISTec GN, Bhopal. My interests span ethical hacking, penetration testing, network security, vulnerability assessment, cloud security, and safe software development.
              </p>
              <p>
                I enjoy learning new technologies and applying cybersecurity concepts through practical projects and hands-on training programs. I believe in building security from the ground up — not as an afterthought.
              </p>
              <p>
                Beyond academics, I've completed multiple Cisco certifications, participated in CTF competitions.
              </p>
              <p>
                By engineering interactive simulators like <b className="text-cyber-cyan font-serif italic">NetDefender</b> and cryptography-backed storages like <b className="text-cyber-cyan font-serif italic">SecureVault</b>, I study how server engines interact with SQL parsing routines, sanitization functions, and relational database layers.
              </p>
            </div>

            {/* Quick Metrics stats grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { count: '5+', label: 'Certifications' },
                { count: '3+', label: 'System Trainings' },
                { count: '2', label: 'Main Projects' },
                { count: '2027', label: 'Graduating Year' }
              ].map((stat, idx) => (
                <div key={idx} className="p-4 bg-cyber-card border border-cyber-border rounded-lg text-center shadow-lg hover:border-cyber-cyan/40 hover:shadow-cyan-500/5 duration-300 transform hover:-translate-y-1">
                  <div className="font-serif italic font-medium text-3xl text-cyber-cyan">{stat.count}</div>
                  <div className="font-mono text-xs text-cyber-muted mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Academic Path</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educationList.map((edu) => (
              <div key={edu.id} className="p-6 bg-cyber-card border border-cyber-border hover:border-cyber-cyan/40 rounded-xl flex flex-col justify-between shadow-lg glow-cyber-hover transition-all duration-300">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-cyber-cyan tracking-widest uppercase">{edu.year}</span>
                  <h4 className="font-display font-black text-lg text-cyber-text mb-2 leading-snug">{edu.degree}</h4>
                  <p className="text-sm font-medium text-cyber-muted flex items-center gap-1"><GraduationCap className="w-4 h-4 text-cyber-cyan" /> {edu.inst}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-cyber-border/40">
                  <span className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full font-mono text-xs text-cyber-cyan">
                    {edu.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Technical Skills</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Languages',
                
                techs: ['C++', 'Python', 'C', 'JavaScript', 'HTML5', 'CSS5']
              },
              {
                title: 'Cyber Security',
              
                techs: ['Penetration Testing', 'Vulnerability Assessment', 'Network Security',]
              },
              {
                title: 'Software/tools',
                
                techs: ['Nmap ','Nessus', 'Autopsy', 'Hydra','John the Ripper','Wireshark', 'Metasploit','Git','Github', 'SQLite / MySQL']
              },
              {
                title: 'Professional Skillset',
            
                techs: ['System Engineering', 'AWS Cloud ', 'Troubleshooting ','Networking']
              }
            ].map((skillCategory, idx) => (
              <div key={idx} className="p-6 bg-cyber-card border border-cyber-border hover:border-cyber-cyan/30 rounded-xl flex flex-col justify-between glow-cyber-hover transition-all duration-300">
                <div className="space-y-4">
                  <div className="border-b border-cyber-border/40 pb-2">
                    <h4 className="font-serif italic text-lg font-medium text-cyber-cyan tracking-wider">{skillCategory.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.techs.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 bg-cyber-purple/5 border border-cyber-purple/20 rounded font-mono text-xs text-[#9CA3AF] hover:text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-colors duration-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE / TIMELINE SECTION */}
        <section id="experience" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Workshop &amp; Training</h2>
          </div>

          <div className="relative border-l border-cyber-border pl-6 space-y-12">
            {timelineList.map((time) => (
              <div key={time.id} className="relative group">
                {/* Node icon */}
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border border-cyber-cyan bg-cyber-bg flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan group-hover:scale-125 transition-transform" />
                </span>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-cyber-cyan tracking-widest uppercase">{time.date}</span>
                  <h4 className="font-serif italic font-medium text-lg text-cyber-text group-hover:text-cyber-cyan transition-colors">{time.title}</h4>
                  <p className="text-xs font-mono text-cyber-purple tracking-widest uppercase">{time.org}</p>
                  <p className="text-cyber-muted text-sm leading-relaxed max-w-3xl">{time.desc}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {time.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/5 border border-cyber-cyan/20 text-[10px] font-mono text-cyber-cyan uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Academic &amp; Practical Projects</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projectList.map((proj) => (
              <div key={proj.id} className="p-6 bg-cyber-card border-2 border-cyber-border hover:border-cyber-cyan/40 rounded-2xl flex flex-col justify-between shadow-xl glow-cyber-hover transition-all duration-300">
                <div className="space-y-4">
                  {/* Header metadata */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-1.5 bg-cyber-bg/80 border border-cyber-border rounded-lg">{proj.icon}</span>
                      <div>
                        <h4 className="font-serif italic font-medium text-xl text-cyber-text leading-tight tracking-wider">{proj.title}</h4>
                        <span className="text-[10px] font-mono text-cyber-cyan/70 tracking-widest uppercase mt-0.5 block">PROJECT SPECIFICATION</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle & Description */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-cyber-text font-mono tracking-wide">{proj.subtitle}</p>
                    <p className="text-cyber-muted text-sm leading-relaxed">{proj.desc}</p>
                  </div>

                  {/* Highlights section */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase block">KEY FEATURES</span>
                    <ul className="text-xs text-cyber-muted space-y-1">
                      {proj.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-cyber-cyan">◈</span>
                          <span className="truncate max-w-full">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {proj.tech.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-cyber-purple/10 border border-cyber-purple/20 rounded font-mono text-[10px] text-cyber-purple">
                        {tech}
                      </span>
                    ))}
                    {proj.tech.length > 4 && (
                      <span className="px-2 py-0.5 bg-cyber-bg/50 border border-cyber-border rounded font-mono text-[10px] text-cyber-muted">
                        +{proj.tech.length - 4} MORE
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6">
                  <button 
                    onClick={() => handleOpenProject(proj)}
                    className="w-full py-2.5 text-center text-xs font-mono bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-black font-semibold border-2 border-cyber-cyan/30 hover:border-cyber-cyan rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    🔍 View Project Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Certificates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationList.map((cert) => (
              <div 
                key={cert.id} 
                className={`p-5 bg-cyber-card border-2 rounded-xl flex flex-col justify-between shadow-md transition-all duration-300 ${cert.id === 'cert-codevita' ? 'border-cyber-cyan hover:border-cyber-cyan glow-cyber' : 'border-cyber-border hover:border-cyber-cyan/30 glow-cyber-hover'}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{cert.icon}</span>
                    {cert.id === 'cert-codevita' && (
                      <span className="px-2 py-0.5 bg-cyber-cyan/10 border border-cyber-cyan/40 text-[8px] font-mono text-cyber-cyan tracking-widest uppercase rounded">
                        FEATURED AWARD
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif italic font-medium text-base text-cyber-text tracking-wider leading-snug">{cert.name}</h4>
                    <span className="text-[10px] font-mono text-cyber-purple tracking-widest uppercase mt-0.5 block">{cert.issuer}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyber-border/40 flex justify-between items-center">
                  <span className="font-mono text-[10px] text-cyber-muted truncate max-w-[150px]">{cert.credentialId || 'ID: NOT_APPLICABLE'}</span>
                  <button 
                    onClick={() => handleOpenCert(cert)}
                    className="p-1 px-2.5 text-[10px] font-mono text-cyber-cyan hover:text-black hover:bg-cyber-cyan border border-cyber-cyan/30 hover:border-cyber-cyan rounded transition-all duration-200 cursor-pointer"
                  >
                    View Attestation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS BLOCK SECTION */}
        <section id="achievements" className="scroll-mt-20">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Security Achievements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
            {[
              { id: 'ach-1', icon: '🚩', text: 'Participated in intense global Capture The Flag (CTF) events, optimizing cryptography isolation and network packet diagnostics.' },
              { id: 'ach-2', icon: '🏆', text: 'Secured a competitive global rank in TCS CodeVita Season XIII, demonstrating advanced algorithmic problem-solving and coding prowess.' }
            ].map((ach) => (
              <div key={ach.id} className="p-4 bg-cyber-card border border-cyber-border rounded-xl flex items-start gap-4">
                <span className="text-2xl p-2 bg-cyber-bg/50 border border-cyber-border rounded-lg shrink-0">{ach.icon}</span>
                <p className="text-cyber-muted text-sm leading-relaxed pt-1">{ach.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-20 min-h-[500px]">
          <div className="border-l-2 border-cyber-cyan pl-5 mb-10">
            <h2 className="font-serif italic font-medium text-3xl text-cyber-text tracking-wide">Contact me</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left direct contact links */}
            <div className="lg:col-span-5 space-y-4">
              <a href="mailto:devendraverma89624@gmail.com" className="p-4 bg-cyber-card border border-cyber-border hover:border-cyber-cyan rounded-xl flex items-center gap-4 transition-all duration-300 group">
                <span className="text-xl p-2.5 bg-cyber-bg border border-cyber-border rounded-lg text-cyber-cyan group-hover:scale-110 tracking-widest"><Mail className="w-5 h-5" /></span>
                <div>
                  <span className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest block">EMAIL DISPATCH</span>
                  <p className="text-sm font-semibold truncate text-cyber-text max-w-[200px] sm:max-w-full">devendraverma89624@gmail.com</p>
                </div>
              </a>

              <a href="tel:+916232889870" className="p-4 bg-cyber-card border border-cyber-border hover:border-cyber-cyan rounded-xl flex items-center gap-4 transition-all duration-300 group">
                <span className="text-xl p-2.5 bg-cyber-bg border border-cyber-border rounded-lg text-cyber-cyan group-hover:scale-110 tracking-widest"><Phone className="w-5 h-5" /></span>
                <div>
                  <span className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest block">TELEPHONY INGRESS</span>
                  <p className="text-sm font-semibold text-cyber-text">+91 6232889870</p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/devendra-verma-573509309" target="_blank" rel="noopener noreferrer" className="p-4 bg-cyber-card border border-cyber-border hover:border-cyber-cyan rounded-xl flex items-center gap-4 transition-all duration-300 group">
                <span className="text-xl p-2.5 bg-cyber-bg border border-cyber-border rounded-lg text-cyber-cyan group-hover:scale-110 tracking-widest"><Globe className="w-5 h-5" /></span>
                <div>
                  <span className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest block">LINKEDIN MATRIX</span>
                  <p className="text-sm font-semibold text-cyber-text">devendra-verma-573509309</p>
                </div>
              </a>

              <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl flex items-center gap-4">
                <span className="text-xl p-2.5 bg-cyber-bg border border-cyber-border rounded-lg text-cyber-cyan shrink-0"><MapPin className="w-5 h-5" /></span>
                <div>
                  <span className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest block">LOCATION COORDINATES</span>
                  <p className="text-sm font-semibold text-cyber-text">Bhopal, MP, India</p>
                </div>
              </div>
            </div>

            {/* Right message forms */}
            <form onSubmit={handleSubmitMail} className="lg:col-span-7 p-6 bg-cyber-card border border-cyber-border rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-cyber-muted tracking-widest uppercase block">YOUR_NAME</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full bg-cyber-bg border border-cyber-border/60 p-2.5 font-sans rounded outline-none focus:border-cyber-cyan text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-cyber-muted tracking-widest uppercase block">YOUR_EMAIL</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full bg-cyber-bg border border-cyber-border/60 p-2.5 font-sans rounded outline-none focus:border-cyber-cyan text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-cyber-muted tracking-widest uppercase block">SUBJECT</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Security Collaboration"
                  className="w-full bg-cyber-bg border border-cyber-border/60 p-2.5 font-sans rounded outline-none focus:border-cyber-cyan text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-cyber-muted tracking-widest uppercase block">MESSAGE</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell me about opportunities or ask me a cybersecurity question..."
                  className="w-full bg-cyber-bg border border-cyber-border/60 p-2.5 font-sans rounded outline-none focus:border-cyber-cyan text-sm h-32 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 btn btn-primary flex gap-2 justify-center items-center font-mono text-xs ${isSubmitting ? 'bg-cyber-cyan/50 text-black/50 cursor-not-allowed' : 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-black cursor-pointer'} font-semibold rounded duration-200`}
              >
                {isSubmitting ? 'TRANSMITTING MESSAGE...' : 'TRANSMIT MESSAGE'} 
                {!isSubmitting && <ArrowRight className="w-4 h-4 text-black" />}
              </button>

              {formStatus.type && (
                <div className={`mt-2 font-mono text-xs text-center p-2 border rounded ${formStatus.type === 'success' ? 'bg-green-950/10 border-green-500/30 text-green-400' : 'bg-red-950/10 border-rose-500/30 text-rose-400'}`}>
                  {formStatus.msg}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-cyber-border py-8 text-center text-xs font-mono text-cyber-muted relative z-10 bg-cyber-bg">
        <p>© 2026 DEVENDRA VERMA · ALL LOGS AUDITED · DESIGNED IN AI STUDIO</p>
      </footer>

      {/* Scroll Top Button */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-xl hover:scale-110 hover:shadow-cyan-500/30 transition-all duration-300 z-50 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 text-black" />
        </button>
      )}

      {/* Universal Modal Trigger for interactive Infographic WAF + Cert */}
      <InteractiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        project={selectedProject}
        certification={selectedCert}
      />
    </div>
  );
}
