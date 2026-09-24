/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Experience, SkillCategory, Service, Testimonial, Certification } from './types';

export const projectsData: Project[] = [
  {
    id: 'synthetix',
    title: 'Synthetix Cloud',
    subtitle: 'High-Throughput Telemetry & Infrastructure Monitor',
    description: 'A cloud infrastructure metrics dashboard with real-time streaming charts, cluster topology visualizations, and zero-latency alerts.',
    longDescription: 'Synthetix Cloud redefines server telemetry by processing and rendering over 50,000 active state changes per second with sub-10ms render cycles. It integrates WebSockets, canvas-based rendering, and optimized tree-shaking algorithms to deliver an ultra-responsive operational command center.',
    image: 'interactive-telemetry',
    techStack: ['React', 'TypeScript', 'D3.js', 'Express', 'WebSockets', 'Tailwind CSS'],
    features: [
      'Real-time metrics streaming with canvas charts',
      'Dynamic force-directed cluster topology maps',
      'Interactive historical time-series analytics',
      'Configurable warning thresholds and alert systems'
    ],
    metrics: [
      { label: 'Throughput', value: '50k+ events/s' },
      { label: 'Render Cycle', value: '< 10ms' },
      { label: 'Uptime achieved', value: '99.999%' }
    ],
    liveDemo: '#',
    github: 'https://github.com/Kamal-Hossain52625/synthetix-cloud',
    category: 'Full-stack',
    caseStudy: {
      challenge: 'Handling massive telemetry updates from multiple microservices caused severe React render-blocking, drop in frame rates (down to 15 FPS), and UI crashes during high load spikes.',
      solution: 'Decoupled state management from React’s standard reconciliation engine. Utilized Web Workers to parse binary socket streams and rendered the metrics on a lightweight HTML5 Canvas with custom D3-driven matrix buffers, maintaining a solid 60 FPS.',
      results: [
        'Maintained fluid 60 FPS performance during high throughput tests',
        'Reduced memory footprints by 64% using array buffers',
        'Empowered engineering teams to diagnose production server hiccups 80% faster'
      ]
    }
  },
  {
    id: 'aura',
    title: 'Aura Headless Commerce',
    subtitle: 'Next-Gen Premium E-Commerce Experience',
    description: 'A dark luxury minimal fashion marketplace leveraging lightning-fast static generation, headless checkout, and elegant fluid transitions.',
    longDescription: 'Aura Commerce is a benchmark of headless architecture, marrying a high-end luxury aesthetic with advanced e-commerce systems. Built with modern commerce APIs, custom search indices, and Stripe integrations, it features instantaneous page loads and visual shopping mechanics.',
    image: 'interactive-commerce',
    techStack: ['React', 'TypeScript', 'Motion', 'Stripe', 'Tailwind CSS'],
    features: [
      'Instantaneous client-side search and faceted filter engine',
      'Interactive 3D carousel and visual product showcase',
      'Seamless multi-currency Stripe custom elements checkout',
      'Localized routing and persistent offline cart mechanics'
    ],
    metrics: [
      { label: 'Lighthouse Performance', value: '100/100' },
      { label: 'Conversion Lift', value: '+28%' },
      { label: 'Load Time', value: '0.4s' }
    ],
    liveDemo: '#',
    github: 'https://github.com/Kamal-Hossain52625/aura-commerce',
    category: 'Frontend',
    caseStudy: {
      challenge: 'Standard e-commerce page transitions and heavy image rendering led to visual stuttering, causing user drop-off on product exploration and sluggish cart operations.',
      solution: 'Implemented visual skeleton loaders, responsive image source matrices, pre-fetched route states using local service workers, and engineered smooth spring-physics based swipe gestures for product view cards.',
      results: [
        'Achieved perfect 100/100 score on Lighthouse Performance indicators',
        'Increased average session duration by 42% due to premium visual feedback',
        'Seamless integration of cart operations without a single server turnaround delay'
      ]
    }
  },
  {
    id: 'vortex',
    title: 'Vortex API Gateway',
    subtitle: 'High-Performance Microservices Router',
    description: 'A secure, scalable reverse proxy and rate-limiting gateway handling millions of requests with automated JWT verification.',
    longDescription: 'Vortex sits at the core of scalable microservices, routing traffic, managing security handshakes, and enforcing API token limits. It relies on extremely optimized, non-blocking Node loops and memory-mapped Redis instances for maximum request processing efficiency.',
    image: 'interactive-gateway',
    techStack: ['Node.js', 'Express', 'Redis', 'TypeScript', 'Docker', 'JWT'],
    features: [
      'Ultra-low latency middleware router (<3ms overhead)',
      'Token-bucket sliding-window rate limiter powered by Redis',
      'Automated public-key cryptographical JWT decryption and validation',
      'Dynamic route registration and health check reporting dashboard'
    ],
    metrics: [
      { label: 'Latency Overhead', value: '< 2.4ms' },
      { label: 'Concurrent Users', value: '120k' },
      { label: 'Failover Rate', value: '0.00%' }
    ],
    liveDemo: '#',
    github: 'https://github.com/Kamal-Hossain52625/vortex-gateway',
    category: 'System',
    caseStudy: {
      challenge: 'Distributed microservices suffered from credential parsing delays and rate limit synchronization failures across global deployments, leading to unauthorized leaks and 504 errors.',
      solution: 'Re-architected the rate-limiting module to use atomic Redis Lua scripts, and established a cache-aside structure for public authentication keys, drastically reducing inter-cluster handshakes.',
      results: [
        'Reduced routing network latency overhead from 45ms to a mere 2.4ms',
        'Secured APIs from brute-force bursts with sub-millisecond throttle responses',
        'Clean, robust system layer praised by enterprise deployment auditors'
      ]
    }
  },
  {
    id: 'apex',
    title: 'Apex Canvas Engine',
    subtitle: 'Advanced Vector Drawing & Layout Suite',
    description: 'An interactive design workspace rendering layered vector graphics, custom grid snapping, and nested geometric grouping in the browser.',
    longDescription: 'Apex Canvas is a professional creative tool designed entirely with core math and native rendering concepts. It supports shape rendering, complex transformations, nested layers, mouse coordinate projections, and export formats (SVG, PNG, JSON).',
    image: 'interactive-canvas',
    techStack: ['React', 'TypeScript', 'HTML5 Canvas', 'Math.js', 'Tailwind CSS'],
    features: [
      'Infinite zoom, pan, and responsive canvas coordinate mapping',
      'Perfect geometric snapping, guidelines, and angle locks',
      'Layer list with lock states, groupings, and opacity sliders',
      'Export matrices to high-fidelity SVG paths or PNG frames'
    ],
    metrics: [
      { label: 'Zoom Range', value: '10% to 3200%' },
      { label: 'Undo/Redo Stack', value: 'Infinite' },
      { label: 'Rendering engine', value: 'Raw WebGL/2D' }
    ],
    liveDemo: '#',
    github: 'https://github.com/Kamal-Hossain52625/apex-canvas',
    category: 'Creative',
    caseStudy: {
      challenge: 'Handling dense vector calculations (thousands of curves and nodes) in JavaScript triggered severe canvas layout updates and lagging selection bounding boxes.',
      solution: 'Implemented spatial partitioning (Quadtree) to optimize raycasting, query select shapes under the cursor instantaneously, and wrapped rendering loops in optimized RequestAnimationFrame pipelines.',
      results: [
        'Renders up to 10,000 vector path elements concurrently at 60 FPS',
        'Intuitive vector-drawing feel with zero input lag',
        'Pristine, mathematical code layout and modular architecture'
      ]
    }
  }
];

export const experienceData: Experience[] = [
  {
    id: 'exp1',
    role: 'Lead Full-Stack Architect',
    company: 'Zenith Tech Solutions',
    location: 'Remote / Singapore',
    period: '2024 - Present',
    type: 'Full-time',
    description: [
      'Led a team of 6 engineers in building a enterprise SaaS platform, scaling monthly active users by 350%.',
      'Designed and deployed microservice patterns reducing cloud hosting overheads by 40% via automated resource provisioning.',
      'Established high-quality CI/CD pipelines, automated testing, and comprehensive TypeScript guidelines across the department.'
    ],
    skillsLearned: ['TypeScript', 'Kubernetes', 'Redis', 'Next.js', 'System Design']
  },
  {
    id: 'exp2',
    role: 'Senior Software Engineer',
    company: 'Nexus Creative Lab',
    location: 'Hybrid / Berlin',
    period: '2022 - 2024',
    type: 'Full-time',
    description: [
      'Spearheaded the development of immersive, high-interaction web experiences for global brands, winning two industry design selections.',
      'Optimized React bundle sizes by 50% through aggressive code-splitting, custom loaders, and visual caching architectures.',
      'Created custom component libraries styled with Tailwind CSS and animated using Framer Motion, shared across 4 partner agencies.'
    ],
    skillsLearned: ['React', 'Framer Motion', 'Performance Tuning', 'UI/UX Design', 'D3.js']
  },
  {
    id: 'exp3',
    role: 'Full-Stack Developer',
    company: 'Alpha Digital Hub',
    location: 'On-site / Dhaka',
    period: '2020 - 2022',
    type: 'Full-time',
    description: [
      'Developed and maintained multi-tenant client dashboards, e-commerce gateways, and database structures using Node and React.',
      'Refactored legacy REST endpoints into robust, self-documenting GraphQL schemas, improving API payload efficiency by 30%.',
      'Worked closely with product teams to translate Figma wireframes into modular, responsive, and pixel-perfect applications.'
    ],
    skillsLearned: ['Node.js', 'Express', 'React', 'MongoDB', 'GraphQL', 'Tailwind CSS']
  }
];

export const skillCategoriesData: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend & Interactive UI',
    description: 'Engineering highly fluid, pixel-perfect, accessible interface experiences with cutting-edge layouts.',
    skills: [
      { name: 'React (v18/19)', level: 98, icon: 'React' },
      { name: 'TypeScript', level: 95, icon: 'TypeScript' },
      { name: 'Tailwind CSS v4', level: 99, icon: 'Tailwind' },
      { name: 'Framer Motion / Motion', level: 94, icon: 'Motion' },
      { name: 'Next.js', level: 92, icon: 'Next' },
      { name: 'D3.js / Recharts', level: 88, icon: 'Data' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Systems',
    description: 'Formulating high-throughput APIs, distributed systems, secure databases, and transactional layers.',
    skills: [
      { name: 'Node.js', level: 93, icon: 'Node' },
      { name: 'Express / Fastify', level: 95, icon: 'Server' },
      { name: 'PostgreSQL / SQL', level: 89, icon: 'Database' },
      { name: 'Redis Caching', level: 85, icon: 'Redis' },
      { name: 'REST & GraphQL APIs', level: 92, icon: 'API' },
      { name: 'Firebase / Firestore', level: 90, icon: 'Firebase' }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Architecture',
    description: 'Automating high-efficiency container deployments, serverless scaling, and repository tooling.',
    skills: [
      { name: 'Docker / Containers', level: 88, icon: 'Docker' },
      { name: 'CI/CD (GitHub Actions)', level: 91, icon: 'CI' },
      { name: 'AWS Cloud Services', level: 86, icon: 'AWS' },
      { name: 'Vercel / Cloud Run', level: 94, icon: 'Cloud' },
      { name: 'System Security (JWT/OAuth)', level: 90, icon: 'Shield' }
    ]
  }
];

export const servicesData: Service[] = [
  {
    id: 'service1',
    title: 'High-End Headless Web Apps',
    description: 'Custom, blazing-fast web applications optimized for maximum client conversion. Blending custom animations, SEO architectures, and rigid responsive styling.',
    priceEstimate: 'Starting from $3,500',
    deliverables: [
      'Pixel-perfect React/Next.js/Vite implementation',
      'Advanced spring-physics page animations & interactive loops',
      'Awwwards-level creative styling & layout rhythms',
      '100/100 Mobile & Desktop Lighthouse SEO optimization'
    ],
    icon: 'Layout'
  },
  {
    id: 'service2',
    title: 'System Design & Backend Architecture',
    description: 'Securing, rate-limiting, and managing database queries for scaling workloads. Crafting API gateways and high-reliability data structures.',
    priceEstimate: 'Starting from $5,000',
    deliverables: [
      'Optimized RESTful or GraphQL server architectures',
      'Redis-powered caching layers and request throttle controls',
      'Database normalization, migrations, and indexing audit',
      'CI/CD repository orchestration & Docker setup'
    ],
    icon: 'Cpu'
  },
  {
    id: 'service3',
    title: 'UI/UX Engineering & Motion Systems',
    description: 'Bridging the gap between conceptual high-fidelity designs and fully interactive codebases. Adding fluid gestures, canvas graphics, and interactive visualizations.',
    priceEstimate: 'Starting from $2,500',
    deliverables: [
      'Interactive interactive canvases & charts (WebGL/Canvas/D3)',
      'Custom reusable, accessible design token system',
      'Micro-interactions, stateful button physics, hover details',
      'Responsive gesture layouts for iOS & Android views'
    ],
    icon: 'Layers'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test1',
    name: 'Marcus Thorne',
    role: 'Founder & CEO',
    company: 'Apex Systems London',
    avatar: 'MT',
    text: 'Kamal is a rare breed of developer. He possesses a refined artistic eye for visual layout, combined with deep technical, low-latency system expertise. He re-engineered our client portal from scratch, achieving a 300% performance boost and praise from all our premium stakeholders.',
    rating: 5
  },
  {
    id: 'test2',
    name: 'Clara Oswald',
    role: 'Head of Engineering',
    company: 'Veloce Digital Group',
    avatar: 'CO',
    text: 'Working with Kamal was a masterclass in professional execution. He delivered a complex multi-layered vector drawing tool in React ahead of schedule. The code architecture was pristine, beautifully modularized, and extremely performant. A solid recommendation.',
    rating: 5
  },
  {
    id: 'test3',
    name: 'Alexei Ivanov',
    role: 'Technical Recruiter',
    company: 'Global Talent Partners',
    avatar: 'AI',
    text: 'Kamal’s resume passed our internal ATS with a perfect match, but his portfolio blew everyone away. We selected him for a high-value advisory contract immediately. He is communicative, responsive, and incredibly fast in diagnosing bottleneck points.',
    rating: 5
  }
];

export const certificationsData: Certification[] = [
  {
    id: 'cert1',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'Dec 2024',
    credentialId: 'AWS-ASA-9942A',
    url: 'https://aws.amazon.com/',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-950/10'
  },
  {
    id: 'cert2',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    date: 'Aug 2023',
    credentialId: 'META-FED-28394',
    url: 'https://www.coursera.org/',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-950/10'
  },
  {
    id: 'cert3',
    title: 'Google Cloud Certified Associate Cloud Engineer',
    issuer: 'Google Cloud Platform',
    date: 'Mar 2025',
    credentialId: 'GCP-ACE-88492',
    url: 'https://cloud.google.com/',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10'
  },
  {
    id: 'cert4',
    title: 'Advanced Full-Stack Engineering Certification',
    issuer: 'freeCodeCamp',
    date: 'Jun 2022',
    credentialId: 'FCC-FSE-203948',
    url: 'https://www.freecodecamp.org/',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-950/10'
  }
];
