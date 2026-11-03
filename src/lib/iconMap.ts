import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react";
import {
  FaReact, FaNodeJs, FaPython, FaDocker, FaCloud, FaLinux, FaLock,
  FaUserTie, FaUserGraduate
} from "react-icons/fa";
import {
  SiMongodb, SiTensorflow, SiTailwindcss, SiExpress, SiPostgresql,
  SiRedux, SiGithubactions, SiJavascript, SiGit, SiTypescript,
  SiRedis, SiPandas
} from "react-icons/si";
import { MdEngineering, MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

export const iconComponents: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Github, Linkedin, Mail, Twitter, Instagram,
  FaReact, FaNodeJs, FaPython, FaDocker, FaCloud, FaLinux, FaLock,
  FaUserTie, FaUserGraduate,
  SiMongodb, SiTensorflow, SiTailwindcss, SiExpress, SiPostgresql,
  SiRedux, SiGithubactions, SiJavascript, SiGit, SiTypescript,
  SiRedis, SiPandas,
  MdEngineering, MdOutlineKeyboardDoubleArrowUp
};

export const iconCategories = {
  social: ["Github", "Linkedin", "Mail", "Twitter", "Instagram"],
  skills: [
    "FaReact", "FaNodeJs", "FaPython", "FaDocker", "FaCloud", "FaLinux", "FaLock",
    "SiMongodb", "SiTensorflow", "SiTailwindcss", "SiExpress", "SiPostgresql",
    "SiRedux", "SiGithubactions", "SiJavascript", "SiGit", "SiTypescript",
    "SiRedis", "SiPandas"
  ],
  education: ["FaUserTie", "FaUserGraduate", "MdEngineering", "MdOutlineKeyboardDoubleArrowUp"]
};

export function getIconComponent(name: string) {
  return iconComponents[name] || Github;
}

export function getIconOptions(category: keyof typeof iconCategories = "skills") {
  return iconCategories[category].map(name => ({ name, component: iconComponents[name] }));
}