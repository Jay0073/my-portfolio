import { PortfolioContentSchema, type PortfolioContent } from "./contentSchema";

const DEFAULT_CONTENT: PortfolioContent = {
  schemaVersion: 1,
  meta: {
    title: "Voutla Jayendra | Full Stack Developer & AI Engineer",
    description:
      "Portfolio of Voutla Jayendra. Expert in MERN Stack, Python, and AI/ML solutions. View my projects and resume.",
    canonical: "https://voutla-jayendra.vercel.app/",
    ogImage: "https://voutla-jayendra.vercel.app/og-image.png",
  },
  hero: {
    name: "Voutla Jayendra",
    phrases: [
      "Full-Stack Developer & AI Innovator.",
      "From Code to Experience, End-to-End.",
      "Engineering Complex Ideas into Scalable Solutions."
    ],
    buttonText: "Explore My Work"
  },
  about: {
    bio: "I'm Voutla Jayendra, a full-stack developer passionate about engineering scalable web applications and exploring AI solutions. My focus is on building efficient systems with clean design and lasting impact.",
    stats: [
      { label: "in Development", value: "2+ Years" },
      { label: "Full-Stack Delivered", value: "10+ Projects" },
      { label: "Across AI & Cloud", value: "5+ Certifications" }
    ],
    values: [
      "Skilled in full-stack engineering",
      "Dedicated to clean, reliable code",
      "Collaborative and growth-oriented"
    ],
    socialLinks: [
      { icon: "Github", href: "https://github.com/Jay0073", label: "My code vault" },
      { icon: "Linkedin", href: "https://linkedin.com/in/voutla-jayendra", label: "Let's get Professional" },
      { icon: "Mail", href: "mailto:voutlajay8765@gmail.com", label: "Inbox open 24/7" },
      { icon: "Twitter", href: "https://twitter.com/", label: "Memes and more" },
      { icon: "Instagram", href: "https://instagram.com/__nameisjay_", label: "Nothing to look here!" }
    ],
    resumeUrl: "https://drive.google.com/file/d/1xld6QHhyoDQxZqKAnfFqL2Kk1xgGrnmx/view?usp=drive_link",
    lottieUrl: "https://lottie.host/ec4e92c1-e225-456f-baf2-4c22c8e3744e/7l9Gqmco8d.lottie"
  },
  experience: [
    {
      company: "Workelate",
      logo: "https://www.workelate.com/images/header/workelate-logo.svg",
      role: "Full Stack Developer Intern",
      dates: "Apr 2025 – Sept 2025",
      description: "Played a key role in shaping core products - TaskNetic, FormNetic, and xNetic - within a dynamic startup ecosystem. Migrated outdated codebases to modern stacks, resolving version conflicts and upgrading dependencies to ensure long-term scalability. Delivered collaborative Kanban workflows in TaskNetic and dynamic form experiences in FormNetic, features that significantly improved user engagement and reduced bounce rates. Partnered with leadership to refine UI/UX across products, optimized backend media handling with AWS S3, and consistently delivered enhancements with 90% post-release stability. Recognized by the co-founder for combining technical rigor with user-centric design in a fast-moving product ecosystem.",
      skills: ["React", "Redux", "Node.js", "Express", "MongoDB", "AWS (Lambda, S3)", "Postman", "Agile Collaboration"],
      stickyTop: 270
    },
    {
      company: "Centennial Infotech",
      logo: "https://centennialinfotech.com/img/logo.png",
      role: "Web Developer Intern",
      dates: "Jan 2025 – March 2025",
      description: "Optimized enterprise web solutions by refactoring React components, improving responsiveness by 35% and reducing load times by 40%. Collaborated with designers to deliver intuitive, user-centric interfaces while integrating backend APIs for smoother business logic automation. Supported deployments with CI/CD pipelines and contributed to a modular, maintainable codebase in a fast-paced environment.",
      skills: ["React", "TailwindCSS", "Express", "Node.js", "MySQL", "MongoDB", "CI/CD", "Postman"],
      stickyTop: 270
    }
  ],
  projects: [
    {
      title: "CrowdFund",
      description: "A secure, full-stack crowdfunding platform where fundraisers launch campaigns and receive donations via Stripe. Built with React, Node.js, and JWT authentication, it ensures smooth user flows and robust security. Real-time dashboards track donations and campaign progress. Designed for scalability and optimized load times, it handles 500+ concurrent API requests, supports 1,000+ active sessions, and processes 200+ transactions per hour with modular architecture.",
      image: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React", "Node.js", "Stripe", "JWT", "MongoDB"],
      links: { demo: "https://crowdfund-eo0d.onrender.com", repo: "https://github.com/Jay0073/CrowdFund" }
    },
    {
      title: "Waste Classifier",
      description: "An AI-powered image classification tool that identifies recyclable vs non-recyclable waste. Trained on 22,000+ images using 3 layer Convolutional Neural Networks, it achieves 92% accuracy. The training pipeline included regularization, early stopping, and learning rate scheduling to ensure robust performance under noisy environments. Built to support sustainability efforts through smart waste sorting.",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Python", "CNN", "TensorFlow", "OpenCV", "Transfer Learning", "AI"],
      links: { demo: "https://github.com/Jay0073/Waste-Classifier", repo: "https://github.com/Jay0073/Waste-Classifier" }
    },
    {
      title: "QuickBill",
      description: "A lightning-fast billing system tailored for business owners and cashiers. Users input items and prices, and the app instantly generates bills with all necessary details. Sales data and customer orders are visualized in a unified dashboard for easy analysis. Built for speed and efficiency, it streamlines billing and decision-making in real time.",
      image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React", "Express", "MongoDB", "Chart.js", "Automation"],
      links: { demo: "https://github.com/Jay0073/Quick-Bill", repo: "https://github.com/Jay0073/Quick-Bill" }
    },
    {
      title: "Lifease",
      description: "An accessibility suite designed for differently abled users including the blind, deaf, and speech-impaired. Offers voice, gesture, and text-based interactions to support daily tasks and communication. Built with inclusive design principles and modular onboarding flows. The app aims to bridge digital gaps and empower users with adaptive tech.",
      image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React Native", "Accessibility", "Firebase", "UX Design"],
      links: { repo: "https://github.com/Jay0073/Lifease" }
    },
    {
      title: "Pigeon Feed",
      description: "A Telegram-based job and tech digest engine that fetches high-quality listings from multiple platforms and delivers them within hours of posting. Users receive personalized job alerts and curated tech news digests, helping them stay ahead without the noise of traditional platforms. The system processes and dispatches updates in under 30 minutes, ensuring relevance and speed.",
      image: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Python", "Telegram Bot", "Job Aggregation", "Scheduling", "Automation"],
      links: { demo: "https://t.me/P_gieon_bot" }
    }
  ],
  skills: [
    { name: "React", icon: "FaReact", percent: 95, desc: ["Hooks", "Context", "SPA"] },
    { name: "JavaScript", icon: "SiJavascript", percent: 90, desc: ["ES6+", "Async", "Event loop"] },
    { name: "TypeScript", icon: "SiTypescript", percent: 75, desc: ["Interfaces", "Generics", "Types"] },
    { name: "TailwindCSS", icon: "SiTailwindcss", percent: 80, desc: ["Rapid UI"] },
    { name: "Redux", icon: "SiRedux", percent: 75, desc: ["Thunk", "Slices", "State Mgmt"] },
    { name: "Node.js", icon: "FaNodeJs", percent: 90, desc: ["High Perf APIs"] },
    { name: "Python", icon: "FaPython", percent: 95, desc: ["Data & ML Workflows", "Automation"] },
    { name: "Express.js", icon: "SiExpress", percent: 85, desc: ["REST APIs", "Middleware"] },
    { name: "MongoDB", icon: "SiMongodb", percent: 80, desc: ["Aggregation", "Indexing"] },
    { name: "Relational DBs", icon: "SiPostgresql", percent: 75, desc: ["Postgres", "MySQL"] },
    { name: "Caching", icon: "SiRedis", percent: 60, desc: ["Redis", "Memcached", "Session Store"] },
    { name: "Data Science", icon: "SiPandas", percent: 80, desc: ["ETL", "Feature Eng", "ML Pipelines"] },
    { name: "Deep Learning", icon: "SiTensorflow", percent: 75, desc: ["CNNs", "Transformers", "LLMs"] },
    { name: "Cloud", icon: "FaCloud", percent: 65, desc: ["AWS S3", "Firebase", "Oracle Cloud"] },
    { name: "Docker", icon: "FaDocker", percent: 65, desc: ["Containerization"] },
    { name: "CI/CD", icon: "SiGithubactions", percent: 50, desc: ["GitHub Actions", "Jenkins"] },
    { name: "OS - Server", icon: "FaLinux", percent: 70, desc: ["Linux", "Nginx"] },
    { name: "Security", icon: "FaLock", percent: 65, desc: ["JWT", "Bcrypt", "CORS"] },
    { name: "Git", icon: "SiGit", percent: 80, desc: ["Branching", "Code Reviews", "Collab"] }
  ],
  education: [
    { year: "2026", institution: "Siddartha Institute of Technology and Sciences", course: "Bachelor of Technology in Computer Science Engineering", icon: "MdEngineering" },
    { year: "2023", institution: "Mahaveer Institute of Science and Technology", course: "Diploma in Electrical and Electronic Engineering", icon: "FaUserGraduate" },
    { year: "2020", institution: "St. Mary's High School", course: "10th standard", icon: "FaUserTie" }
  ],
  certificates: [
    { src: "/assets/nvidia-dp.png", name: "Getting Started with Deep Learning", issuer: "NVIDIA", year: "2024" },
    { src: "/assets/cisco-cybersecurity.jpg", name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", year: "2024" },
    { src: "/assets/cisco-ethicalHack.jpg", name: "Ethical Hacker", issuer: "Cisco Networking Academy", year: "2025" },
    { src: "/assets/iirs.jpg", name: "Geo-Data Sharing and Cyber Security", issuer: "IIRS", year: "2025" },
    { src: "/assets/jetking-python.jpg", name: "Python Workshop", issuer: "Jetking ECIL", year: "2023" },
    { src: "/assets/nvidia-diffusion.png", name: "Generative AI with Diffusion Models", issuer: "NVIDIA", year: "2025" },
    { src: "/assets/nvidia-transformer.png", name: "Introduction to Transformer-Based Natural Language Processing", issuer: "NVIDIA", year: "2024" }
  ],
  quotes: [
    { text: "Code is like humor. If you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" },
    { text: "Java is to JavaScript what car is to Carpet.", author: "Chris Heilmann" },
    { text: "The best way to get a project done faster is to start sooner.", author: "Jim Highsmith" },
    { text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupery" }
  ],
  footer: {
    quote: "Behind every interface I build is a developer still learning, still growing.",
    words: ["Connect.", "Collaborate.", "Code.", "Build.", "Grow Together."],
    tagline: "Whether it's code, coffee, or conversation - I'm just one click away.",
    copyright: "© 2025 Voutla Jayendra · Designed to impress 👀 Debugged to perfection ✨",
    socialLinks: [
      { icon: "Github", href: "https://github.com/Jay0073", label: "My code vault" },
      { icon: "Linkedin", href: "https://linkedin.com/in/voutla-jayendra", label: "Let's get Professional" },
      { icon: "Mail", href: "mailto:voutlajay8765@gmail.com", label: "Inbox open 24/7" },
      { icon: "Twitter", href: "https://twitter.com/", label: "Memes and more" },
      { icon: "Instagram", href: "https://instagram.com/__nameisjay_", label: "Nothing to look here!" }
    ]
  },
  header: {
    socialLinks: [
      { icon: "Github", href: "https://github.com/Jay0073", label: "My code vault" },
      { icon: "Linkedin", href: "https://linkedin.com/in/voutla-jayendra", label: "Let's get Professional" },
      { icon: "Mail", href: "mailto:voutlajay8765@gmail.com", label: "Inbox open 24/7" },
      { icon: "Twitter", href: "https://twitter.com/", label: "Memes and more" },
      { icon: "Instagram", href: "https://instagram.com/__nameisjay_", label: "Nothing to look here!" }
    ]
  }
};

export { DEFAULT_CONTENT, PortfolioContentSchema };
export type { PortfolioContent } from "./contentSchema";