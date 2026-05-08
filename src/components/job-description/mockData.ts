import { JobDescriptionRecord } from './types';

export const INITIAL_JDS: JobDescriptionRecord[] = [
  {
    id: 'JD-ENG-001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: '$120,000 - $160,000',
    reportsTo: 'Director of Engineering',
    status: 'Active',
    dateCreated: '2024-01-15',
    dateLastModified: '2024-01-20',
    summary: 'We are looking for a Senior Software Engineer to lead the design, development, and maintenance of our core business applications. You will work closely with cross-functional teams to deliver high-quality, scalable solutions.',
    responsibilities: [
      { id: '1', value: 'Architect and develop scalable and reliable backend services.' },
      { id: '2', value: 'Mentor junior and mid-level engineers, providing guidance on best practices.' },
      { id: '3', value: 'Collaborate with product managers and designers to define project requirements.' },
      { id: '4', value: 'Participate in code reviews to ensure code quality and maintainability.' }
    ],
    requirements: [
      { id: '1', value: "Bachelor's degree in Computer Science or related field." },
      { id: '2', value: '5+ years of experience in software development.' },
      { id: '3', value: 'Strong proficiency in TypeScript, Node.js, and React.' },
      { id: '4', value: 'Experience with cloud platforms such as AWS or Google Cloud.' }
    ],
    skills: [
      { id: '1', value: 'TypeScript' },
      { id: '2', value: 'Node.js' },
      { id: '3', value: 'React' },
      { id: '4', value: 'GraphQL' },
      { id: '5', value: 'System Design' }
    ]
  },
  {
    id: 'JD-MKT-002',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '$90,000 - $110,000',
    reportsTo: 'CMO',
    status: 'Draft',
    dateCreated: '2024-03-05',
    dateLastModified: '2024-03-10',
    summary: 'The Marketing Manager will be responsible for developing and executing targeted marketing campaigns to drive brand awareness and lead generation.',
    responsibilities: [
      { id: '1', value: 'Develop and execute marketing campaigns across multiple channels.' },
      { id: '2', value: 'Analyze campaign performance metrics and optimize strategies.' },
      { id: '3', value: "Manage the company's social media presence." },
      { id: '4', value: 'Collaborate with the sales team to align marketing efforts with revenue goals.' }
    ],
    requirements: [
      { id: '1', value: "Bachelor's degree in Marketing, Communications, or related field." },
      { id: '2', value: '3-5 years of experience in digital marketing.' },
      { id: '3', value: 'Proven track record of managing successful marketing campaigns.' }
    ],
    skills: [
      { id: '1', value: 'Digital Marketing' },
      { id: '2', value: 'SEO/SEM' },
      { id: '3', value: 'Content Strategy' },
      { id: '4', value: 'Analytics' }
    ]
  }
];
