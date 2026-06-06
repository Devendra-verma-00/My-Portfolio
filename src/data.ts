import { Project, Certification, TimelineItem, EducationItem } from './types';

export const educationList: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'B.Tech Cyber Security',
    inst: 'SISTec GN, Bhopal',
    year: '2023 – 2027',
    score: 'CGPA: 6.52'
  },
  {
    id: 'edu-2',
    degree: 'Higher Secondary (12th)',
    inst: 'Nutan Bal Vidhya Mandir, Sehore',
    year: '2023',
    score: '66%'
  },
  {
    id: 'edu-3',
    degree: 'High School (10th)',
    inst: 'Amlaha Public School, Sehore',
    year: '2021',
    score: '67%'
  }
];

export const projectList: Project[] = [
  {
    id: 'proj-netdefender',
    title: 'NetDefender',
    subtitle: 'Custom WAF-Based Web Application Security & Real-Time Threat Monitoring System',
    icon: '🛡️',
    desc: 'An advanced enterprise-class Web Application Firewall (WAF) and central threat monitoring dashboard. It inspects all incoming HTTP requests, intercepts common OWASP Top 10 vulnerabilities (including SQL Intrusions and Cross-Site Scripting), automatically triggers real-time rate limiting or IP banning, and aggregates attack logs through a secure MySQL pipeline.',
    tech: ['Apache2', 'ModSecurity', 'OWASP CRS', 'PHP', 'MySQL', 'Ubuntu Server', 'HTML5/CSS3', 'JavaScript', 'AJAX'],
    features: [
      'SQL Injection & XSS Protection: Protects servers against input payload hazards',
      'Real-Time Threat Detection & Automated IP Rate-Limiting & Blocking',
      'Unified Dashboard: Secure centralized visualizer of live web traffic metrics',
      'Log Parsing Pipeline: Custom parser.php scripts convert server logs into structured relational records',
      'Central Database Logging: Persistent audit logs for long-term intelligence'
    ],
    githubUrl: 'https://github.com/devendra-verma-00',
    demoUrl: '#',
    pipeline: ['Users', 'WAF Engine (ModSecurity)', 'Security Logs', 'Parser Engine (parser.php)', 'MySQL DB', 'Live Dashboard'],
    metrics: [
      { label: 'ATTACKS BLOCKED', count: '12,345', color: 'text-cyber-cyan' },
      { label: 'SQLi ATTEMPTS', count: '533', color: 'text-rose-500' },
      { label: 'XSS PROTECTION', count: '256', color: 'text-cyber-purple' },
      { label: 'BANNED IPS', count: '1,813', color: 'text-amber-500' }
    ],
    team: [
      { name: 'Devendra Verma', isUser: true },
      { name: 'Tarun Parmar', isUser: false },
      { name: 'Vinod Mewada', isUser: false }
    ],
    guide: 'Prof. Yogesh Kumar Sharma',
    coordinator: 'Dr. Pranoti S.K.'
  },
  {
    id: 'proj-securevault',
    title: 'SecureVault',
    subtitle: 'Secure File Upload & Encrypted Storage Web App',
    icon: '🔒',
    desc: 'A robust cloud-inspired file storage vault implementing secure cryptographic key storage and biometric-ready MFA. Users can organize, share, research, and retrieve files with granular folder-level permissions, secure sessions, and encrypted payload directories.',
    tech: ['Python Flask', 'Cryptography', 'AES-256', 'HTML5', 'CSS3', 'JavaScript', 'SQLite'],
    features: [
      'AES-256 Cryptographic Encryption for resting store security',
      'OTP-based Multi-Factor Authentication (MFA) via email dispatching',
      'Secure Multipart Upload with automated validation filters',
      'Folder-Level Access Controls & strict user token authorization',
      'Vulnerability protected sessions against CSRF and Session Hijacking'
    ],
    githubUrl: 'https://github.com/devendra-verma-00',
    demoUrl: '#',
    metrics: [
      { label: 'ENCRYPTION', count: 'AES-256', color: 'text-cyber-cyan' },
      { label: 'SECURE AUTH', count: 'OTP + MFA', color: 'text-cyber-purple' }
    ]
  }
];

export const certificationList: Certification[] = [
  {
    id: 'cert-codevita',
    name: 'TCS CodeVita Season XIII Rank Certificate',
    issuer: 'TATA CONSULTANCY SERVICES (TCS)',
    icon: '🏆',
    credentialId: 'TCS-CV13-GL3194-SYS',
    url: '#',
    image: '/images/cert-codevita.jpg'
  },
  {
    id: 'cert-ccna-enterprise',
    name: 'CCNA: Enterprise Networking, Security, and Automation',
    issuer: 'CISCO',
    icon: '🌐',
    credentialId: 'e04036cb-c6e4-407e-9c8c-508b0b6508e5',
    url: '#',
    image: '/images/cert-ccna-enterprise.jpg'
  },
  {
    id: 'cert-networks',
    name: 'CCNA: Introduction to Networks',
    issuer: 'CISCO',
    icon: '🔗',
    credentialId: '476356e4-85fe-4329-bdc3-c14dd4c63965',
    url: '#',
    image: '/images/cert-networks.jpg'
  },
  {
    id: 'cert-ccna-switching',
    name: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'CISCO',
    icon: '📶',
    credentialId: '345a1b67-c0ce-4e38-b9d5-9eac780dc1fa',
    url: '#',
    image: '/images/cert-ccna-switching.jpg'
  },
  {
    id: 'cert-cyber1',
    name: 'Introduction to Cybersecurity',
    issuer: 'CISCO',
    icon: '🛡️',
    credentialId: 'SISTec-Cisco-Cyber',
    url: '#',
    image: '/images/cert-cybersecurity.jpg'
  },
  {
    id: 'cert-modern-ai',
    name: 'Introduction to Modern AI',
    issuer: 'CISCO',
    icon: '🧠',
    credentialId: 'SISTec-Cisco-ModernAI',
    url: '#',
    image: '/images/cert-modern-ai.jpg'
  },
  {
    id: 'cert-ai',
    name: 'Apply AI: Analyze Customer Reviews',
    issuer: 'CISCO',
    icon: '🤖',
    credentialId: 'SISTec-Cisco-ApplyAI',
    url: '#',
    image: '/images/cert-apply-ai.jpg'
  },
  {
    id: 'cert-python1',
    name: 'Python Essentials 1',
    issuer: 'Python Institute',
    icon: '🐍',
    credentialId: 'SISTec-Python-PE1',
    url: '#',
    image: '/images/cert-python1.jpg'
  },
  {
    id: 'cert-python2',
    name: 'Python Essentials 2',
    issuer: 'Python Institute',
    icon: '🐍',
    credentialId: '06599809-9a71-4e5a-90f4-fcb9266f7d83',
    url: '#',
    image: '/images/cert-python2.jpg'
  },
  {
    id: 'cert-aws',
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'AMAZON WEB SERVICES (AWS)',
    icon: '☁️',
    credentialId: 'AWS-TRNG-ESS-2026',
    url: '#',
    image: '/images/cert-aws.jpg'
  },
  {
    id: 'cert-whatsapp-2026',
    name: 'Digital Forensics & Incident Investigation',
    issuer: 'Red Team Leaders',
    icon: '📜',
    credentialId: 'N/A',
    url: '#',
    image: '/images/cert-whatsapp-2026.jpg'
  }
];

export const timelineList: TimelineItem[] = [
  {
    id: 'time-vapt',
    date: '2026 · SISTec GN',
    title: 'Vulnerability Assessment & Penetration Testing',
    org: 'Intensive VAPT Training Program',
    desc: 'Underwent professional training focusing on Kali Linux payloads, offensive toolkits, Nmap vulnerability correlation, Wireshark traffic isolation, Nessus automation reporting, and secure mitigation strategies for the top enterprise security vectors.',
    tags: ['VAPT', 'Web App Exploitation', 'OWASP Wanguard', 'Auditing']
  },
  {
    id: 'time-webdev',
    date: '2025 · SISTec GN',
    title: 'Frontend Development & Web Architecture',
    org: 'Full-Stack Prep Program',
    desc: 'Mastered standard web technologies, responsive browser UI engineering with modern responsive designs, interactive animations, and dynamic state-driven web applications.',
    tags: ['Interactive UX', 'DOM APIs', 'CSS Layouts', 'Build Pipelines']
  },
  {
    id: 'time-cpp',
    date: '2024 · SISTec GN',
    title: 'C & C++ Systems Programming',
    org: 'Practical Boot camp Track',
    desc: 'Enrolled in a grueling training track centering around native memory structures, object-oriented implementations, data structures, complexity mapping, and algorithms optimization.',
    tags: ['Memory Management', 'Algorithms', 'High-Perf', 'System Design']
  }
];
