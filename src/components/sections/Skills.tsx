import React, { useState } from 'react';
import SectionWrapper from '../common/SectionWrapper';
import Card from '../common/Card';
import ProficiencyIndicator from '../common/ProficiencyIndicator';

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Machine Learning', 'DevOps', 'Others'];

  const skills = [
    {
      name: 'React',
      category: 'Frontend',
      level: 'Advanced' as const,
      description: 'Building reusable components for dynamic UIs.',
      projects: 'Crowd-Funding, Language Translator'
    },
    {
      name: 'Express.js',
      category: 'Backend',
      level: 'Expert' as const,
      description: 'Efficient routing and API development.',
      projects: 'Hacker News Scraper'
    },
    {
      name: 'TensorFlow',
      category: 'Machine Learning',
      level: 'Advanced' as const,
      description: 'Implementing neural networks for data analysis.',
      projects: 'Students Performance Indicator'
    },
    {
      name: 'Docker',
      category: 'DevOps',
      level: 'Intermediate' as const,
      description: 'Containerization for consistent deployments.',
      projects: 'Workelate Projects'
    },
    {
      name: 'TailwindCSS',
      category: 'Frontend',
      level: 'Expert' as const,
      description: 'Rapid styling with utility classes.',
      projects: 'Motion Cut, Portfolio UI'
    },
    {
      name: 'MongoDB',
      category: 'Backend',
      level: 'Advanced' as const,
      description: 'NoSQL database management.',
      projects: 'Multiple projects'
    },
    {
      name: 'Python',
      category: 'Machine Learning',
      level: 'Advanced' as const,
      description: 'Data analysis and ML model development.',
      projects: 'Language Translator, Students Performance'
    },
    {
      name: 'Node.js',
      category: 'Backend',
      level: 'Expert' as const,
      description: 'Server-side JavaScript development.',
      projects: 'Multiple full-stack applications'
    }
  ];

  const secondaryTools = [
    'Git', 'MySQL', 'Figma', 'Streamlit', 'OpenCV', 'Pandas', 'AWS', 'Jupyter'
  ];

  const filteredSkills = skills.filter(skill => 
    activeCategory === 'All' || skill.category === activeCategory
  );

  return (
    <SectionWrapper
      id="skills"
      title="Skills & Technologies"
      subtitle="Core Competencies and Tools"
    >
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeCategory === category
                ? 'bg-white text-[#1A1A1A] border-white'
                : 'bg-transparent text-[#BBBBBB] border-[#BBBBBB] hover:text-white hover:border-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skill Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredSkills.map((skill, index) => (
          <div key={index} className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-lg text-white">
                {skill.name}
              </h3>
              <span className="px-2 py-1 text-xs bg-[#BBBBBB]/20 text-[#BBBBBB] rounded">
                {skill.category}
              </span>
            </div>
            
            <p className="text-[#BBBBBB] text-sm mb-4 leading-relaxed">
              {skill.description}
            </p>
            
            <div className="mb-4">
              <ProficiencyIndicator level={skill.level} />
            </div>
            
            <div className="text-xs text-[#BBBBBB]">
              <strong>Used in:</strong> {skill.projects}
            </div>
          </div>
        ))}
      </div>

      {/* Tool Belt Carousel */}
      <div className="mb-12">
        <h3 className="font-poppins font-semibold text-xl text-white text-center mb-8">
          Additional Tools & Technologies
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {secondaryTools.map((tool, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#1A1A1A] text-[#BBBBBB] rounded-full border border-[#BBBBBB]/20 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Matrix */}
      <div className="bg-[#1A1A1A] rounded-lg p-6 overflow-x-auto">
        <h3 className="font-poppins font-semibold text-xl text-white mb-6 text-center">
          Skill Application Matrix
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#BBBBBB]/20">
              <th className="text-white font-semibold py-3 px-4">Skill</th>
              <th className="text-white font-semibold py-3 px-4">Projects Used In</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#BBBBBB]/10">
              <td className="text-[#BBBBBB] py-3 px-4">React</td>
              <td className="text-[#BBBBBB] py-3 px-4">Crowd-Funding, Language Translator</td>
            </tr>
            <tr className="border-b border-[#BBBBBB]/10">
              <td className="text-[#BBBBBB] py-3 px-4">Keras</td>
              <td className="text-[#BBBBBB] py-3 px-4">Students Performance Indicator</td>
            </tr>
            <tr>
              <td className="text-[#BBBBBB] py-3 px-4">TailwindCSS</td>
              <td className="text-[#BBBBBB] py-3 px-4">Motion Cut, Portfolio UI</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
};

export default Skills;