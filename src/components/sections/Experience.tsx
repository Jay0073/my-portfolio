import React from 'react';
import SectionWrapper from '../common/SectionWrapper';
import TimelineEntry from '../common/TimelineEntry';
import Button from '../common/Button';

const Experience: React.FC = () => {
  const experiences = [
    {
      company: 'Workelate',
      role: 'Web Developer Intern',
      dates: 'May 2025 – Present',
      description: 'Developed microservices in Node.js, containerized with Docker, reducing deployment times by 30%. Collaborated in Agile teams and integrated with AWS Lambda.',
      skills: ['Node.js', 'Express', 'Docker', 'AWS (Lambda, S3)', 'Git', 'Scrum']
    },
    {
      company: 'Centennial Infotech',
      role: 'Web Developer Intern',
      dates: 'Jan 2025 – March 2025',
      description: 'Improved UI responsiveness by 25% and reduced page-load times by 20% through React refactoring.',
      skills: ['React', 'TailwindCSS', 'JavaScript', 'Git', 'Agile']
    },
    {
      company: 'Motion Cut',
      role: 'Frontend Intern',
      dates: 'Nov 2024 – Dec 2024',
      description: 'Converted designs to interactive UIs, enhancing UX metrics by 30% using TailwindCSS.',
      skills: ['HTML/CSS', 'JavaScript', 'TailwindCSS', 'Figma', 'Responsive Design']
    }
  ];

  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/in/[username]', '_blank');
  };

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      subtitle="Professional Roles and Contributions"
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#BBBBBB]"></div>

        {/* Timeline entries */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <TimelineEntry
              key={index}
              company={exp.company}
              role={exp.role}
              dates={exp.dates}
              description={exp.description}
              skills={exp.skills}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <Button
          text="View LinkedIn Profile"
          onClick={handleLinkedInClick}
          style="secondary"
        />
      </div>
    </SectionWrapper>
  );
};

export default Experience;