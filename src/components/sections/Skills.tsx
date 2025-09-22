import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import SectionWrapper from "../common/SectionWrapper";
import { FaReact, FaNodeJs, FaPython, FaDocker, FaCloud } from "react-icons/fa";
import {
  SiMongodb,
  SiTensorflow,
  SiTailwindcss,
  SiExpress,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiMysql,
  SiGit,
} from "react-icons/si";

const SkillsBubbles: React.FC = () => {
  const width = 900;
  const height = 800;
  const [nodes, setNodes] = useState<any[]>([]);
  const skills = [
    { name: "React", icon: FaReact, percent: 95 },
    { name: "Node.js", icon: FaNodeJs, percent: 90 },
    { name: "Express.js", icon: SiExpress, percent: 85 },
    { name: "TailwindCSS", icon: SiTailwindcss, percent: 80 },
    { name: "MongoDB", icon: SiMongodb, percent: 70 },
    { name: "Python", icon: FaPython, percent: 90 },
    { name: "TensorFlow", icon: SiTensorflow, percent: 75 },
    { name: "Docker", icon: FaDocker, percent: 65 },
    { name: "", icon: SiMysql, percent: 60 },
    { name: "Git", icon: SiGit, percent: 80 },
    { name: "Cloud", icon: FaCloud, percent: 60 },
    { name: "HTML", icon: SiHtml5, percent: 85 },
    { name: "CSS", icon: SiCss3, percent: 80 },
    { name: "JavaScript", icon: SiJavascript, percent: 90 },
  ];

  // Find the largest bubble (highest percent)
  const maxPercent = Math.max(...skills.map((s) => s.percent));
  const centerIndex = skills.findIndex((s) => s.percent === maxPercent);

  useEffect(() => {
    const radiusScale = d3.scaleLinear().domain([50, 100]).range([35, 100]);
    // Place the largest bubble at the center
    const initialNodes = skills.map((s, i) => ({
      ...s,
      radius: radiusScale(s.percent),
      x: width / 2,
      y: height / 2,
      fx: i === centerIndex ? width / 2 : undefined,
      fy: i === centerIndex ? height / 2 : undefined,
      index: i,
    }));

    const simulation = d3
      .forceSimulation(initialNodes as any)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.radius + 6)
      )
      .force(
        "radial",
        d3
          .forceRadial(
            180, // distance from center
            width / 2,
            height / 2
          )
          .strength((d: any) => (d.index === centerIndex ? 0 : 0.4))
      )
      .alpha(1)
      .alphaDecay(0.03)
      .on("tick", () => {
        setNodes([...initialNodes]);
      });

    return () => simulation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SectionWrapper
      id="skills"
      title="Skills & Technologies"
      subtitle="Floating Bubble Cluster"
      className="mb-0"
      headingClass="mb-8"
    >
      <div className="flex justify-center">
        <svg width={width} height={height} style={{ maxWidth: "100%" }}>
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <g
                key={node.name}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: "pointer" }}
              >
                <circle
                  r={node.radius}
                  fill="#1A1A1A"
                  stroke="#b0b0b0"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)",
                  }}
                />
                <foreignObject
                  x={-node.radius}
                  y={-node.radius}
                  width={node.radius * 2}
                  height={node.radius * 2}
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      color: "white",
                      fontSize: 12,
                      textAlign: "center",
                      userSelect: "none",
                    }}
                  >
                    <span style={{ fontSize: node.radius * 0.7 }}>
                      {Icon && <Icon />}
                    </span>
                    <span style={{ marginTop: 4 }}>{node.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </SectionWrapper>
  );
};

export default SkillsBubbles;
