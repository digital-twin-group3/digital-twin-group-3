// Application configuration and constants

export const PERSONA = `You are the digital twin of Alex Chen, a Senior Full-Stack Engineer with 7 years of experience specializing in React, Next.js, TypeScript, Node.js, and AI/ML integrations. You are warm, direct, and thoughtful. You speak in first person as Alex.

Key facts about Alex:
- Currently open to senior IC or staff engineering roles at product-focused companies
- Strong background in building scalable web apps, developer tools, and AI-powered products  
- Past work includes a Series B fintech startup (led frontend platform), an AI infrastructure company, and freelance consulting
- Prefers remote-first teams in the US, ideally distributed across time zones
- Interested in: developer tooling, AI/ML products, consumer apps, edtech
- Compensation range: $180k–$220k base + equity
- Available to start: 4–6 weeks notice

When a recruiter or hiring manager seems interested, offer to schedule a call or share more about a specific role. Keep answers concise and professional but with personality. Never make up specific company names or projects you haven't been told about. If asked something you don't know, say so honestly.`;

export const QUICK_PROMPTS = [
  "What's your background?",
  "Are you open to roles right now?",
  "What tech stack do you prefer?",
  "Can we schedule a call?",
  "Show me your best project",
];

export const INTRO_CARDS = [
  {
    label: 'Experience',
    title: 'Tell me about your experience as a full-stack engineer.',
    description: 'What have you built and where have you worked?',
  },
  {
    label: 'Opportunities',
    title: 'What kind of role are you looking for?',
    description: 'What roles and companies interest you right now?',
  },
  {
    label: 'Skills',
    title: 'What are your strongest technical skills?',
    description: 'Tech stack, areas of depth, what you love to build',
  },
  {
    label: 'Connect',
    title: 'How can we work together or get in touch?',
    description: 'Schedule a call, share your role, or say hello',
  },
];

export const SIDEBAR_SECTIONS = [
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'about', label: 'About', icon: 'about' },
  { id: 'work', label: 'Work', icon: 'work' },
  { id: 'schedule', label: 'Schedule', icon: 'schedule' },
];

export const PERSON_PROFILE = {
  name: process.env.NEXT_PUBLIC_PERSON_NAME || 'Alex Chen',
  role: process.env.NEXT_PUBLIC_PERSON_ROLE || 'Senior Full-Stack Engineer',
  tagline: 'Senior Full-Stack Engineer · AI/ML · Open to work',
  location: 'San Francisco, CA',
  email: 'alex@example.com',
  linkedin: 'linkedin.com/in/alexchen',
  github: 'github.com/alexchen',
  status: 'Available for opportunities',
};

export const MAX_RESPONSE_TOKENS = 1000;
export const API_TIMEOUT = 30000;
export const CACHE_TTL = 24 * 60 * 60; // 24 hours
