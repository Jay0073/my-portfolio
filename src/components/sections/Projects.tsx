import React, { useState } from "react";
import SectionWrapper from "../common/SectionWrapper";
import Card from "../common/Card";
import ElectricBorder from "../items/ElectricBorder";

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Web Apps", "Machine Learning", "Utilities"];

  const projects = [
    {
      title: "Language Translator",
      description:
        "A Python-based tool supporting text translation, speech-to-text, text-to-speech, and summarization across 107 languages using Flask and Google Cloud APIs.",
      tags: ["Python", "Flask", "Google Cloud Speech API", "React"],
      category: ["Machine Learning", "Utilities"],
      image:
        "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600",
      actions: [
        { text: "View Details", onClick: () => window.open("#", "_blank") },
        { text: "Live Demo", onClick: () => window.open("#", "_blank") },
      ],
    },
    {
      title: "Hacker News Scraper",
      description:
        "Node.js application for scraping headlines from Hacker News, outputting JSON data, with scheduled cron jobs for updates.",
      tags: ["Node.js", "Cheerio", "Express", "MongoDB"],
      category: ["Web Apps"],
      image:
        "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=600",
      actions: [
        { text: "View Details", onClick: () => window.open("#", "_blank") },
        { text: "Live Demo", onClick: () => window.open("#", "_blank") },
      ],
    },
    {
      title: "Students Performance Indicator",
      description:
        "ML model using Jupyter Notebook to predict student grades, improving accuracy by 15% through feature engineering.",
      tags: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
      category: ["Machine Learning"],
      image:
        "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600",
      actions: [
        { text: "View Details", onClick: () => window.open("#", "_blank") },
        { text: "Live Demo", onClick: () => window.open("#", "_blank") },
      ],
    },
    {
      title: "Crowd-Funding Platform",
      description:
        "Full-stack platform with React frontend and Node.js backend for secure payments, supporting up to 500+ users.",
      tags: ["React", "Node.js", "Express", "Stripe API", "MongoDB"],
      category: ["Web Apps"],
      image:
        "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=600",
      actions: [
        { text: "View Details", onClick: () => window.open("#", "_blank") },
        { text: "Live Demo", onClick: () => window.open("#", "_blank") },
      ],
    },
  ];

  const filteredProjects = projects.filter(
    (project) =>
      activeFilter === "All" || project.category.includes(activeFilter)
  );

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="Selected Works Demonstrating Technical Skills"
    >
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeFilter === category
                ? "bg-white text-[#1A1A1A] border-white"
                : "bg-transparent text-[#BBBBBB] border-[#BBBBBB] hover:text-white hover:border-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <Card
            key={index}
            title={project.title}
            description={project.description}
            tags={project.tags}
            image={project.image}
            actions={project.actions}
          />
        ))}
      </div>

      {/* Load More Button (placeholder) */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-[#BBBBBB] text-[#BBBBBB] rounded-md hover:text-white hover:border-white transition-all duration-300">
          Load More Projects
        </button>
      </div>
    </SectionWrapper>
  );
};

export default Projects;
