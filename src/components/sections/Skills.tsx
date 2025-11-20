import React, { useEffect, useState, useRef, useMemo } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<any[]>([]);
  
  // 1. Store simulation in a ref so drag events can access the current instance safely
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  // --- Tooltip State ---
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Wrap skills in useMemo to prevent unnecessary re-calculations
  const skills = useMemo(() => [
    { name: "React", icon: FaReact, percent: 95, desc: "3 Years Exp" },
    { name: "Node.js", icon: FaNodeJs, percent: 90, desc: "Scalable APIs" },
    { name: "Express.js", icon: SiExpress, percent: 85, desc: "Middleware" },
    { name: "TailwindCSS", icon: SiTailwindcss, percent: 80, desc: "Rapid UI" },
    { name: "MongoDB", icon: SiMongodb, percent: 70, desc: "NoSQL" },
    { name: "Python", icon: FaPython, percent: 90, desc: "Data Scripting" },
    { name: "TensorFlow", icon: SiTensorflow, percent: 75, desc: "ML Models" },
    { name: "Docker", icon: FaDocker, percent: 65, desc: "Containerization" },
    { name: "", icon: SiMysql, percent: 60, desc: "Relational DB" },
    { name: "Git", icon: SiGit, percent: 80, desc: "Version Control" },
    { name: "Cloud", icon: FaCloud, percent: 60, desc: "AWS / Azure" },
    { name: "HTML", icon: SiHtml5, percent: 85, desc: "Semantic Markup" },
    { name: "CSS", icon: SiCss3, percent: 80, desc: "Animations" },
    { name: "JavaScript", icon: SiJavascript, percent: 90, desc: "ES6+" },
  ], []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 600,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Create the drag handler once using useMemo
  const drag = useMemo(() => {
    return d3
      .drag<SVGGElement, any>()
      .on("start", (event, d) => {
        // Use simulationRef.current to access the active simulation
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        setHoveredNode(null);
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const isMobile = width < 640;
    const minRadius = isMobile ? 25 : 35;
    const maxRadius = isMobile ? 60 : 100;

    const radiusScale = d3
      .scaleLinear()
      .domain([50, 100])
      .range([minRadius, maxRadius]);

    const maxPercent = Math.max(...skills.map((s) => s.percent));
    const centerIndex = skills.findIndex((s) => s.percent === maxPercent);

    const initialNodes = skills.map((s, i) => ({
      ...s,
      radius: radiusScale(s.percent),
      x: width / 2,
      y: height / 2,
      index: i,
    }));

    const simulation = d3
      .forceSimulation(initialNodes as any)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.radius + 6)
      )
      .alpha(1)
      .alphaDecay(0.03);

    const isLandscape = width > height;
    if (isLandscape) {
      simulation
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.3));
    } else {
      simulation.force(
        "radial",
        d3
          .forceRadial(
            isMobile ? width / 3 : 180,
            width / 2,
            height / 2
          )
          .strength((d: any) => (d.index === centerIndex ? 0 : 0.4))
      );
    }

    simulation.on("tick", () => {
      setNodes([...initialNodes]);
    });

    // Assign the simulation to the ref so the drag handler can see it
    simulationRef.current = simulation;

    // Note: We REMOVED the d3.select(svgRef).selectAll... block from here
    // We now handle it in the render loop below.

    return () => {
        simulation.stop();
    };
  }, [dimensions, drag, skills]); // Added drag and skills to deps

  // --- Tooltip Handlers ---
  const handleMouseEnter = (e: React.MouseEvent, node: any) => {
    setHoveredNode(node);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredNode) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <SectionWrapper
      id="skills"
      title="Skills & Technologies"
      subtitle="Floating Bubble Cluster"
      className="mb-0"
      headingClass="mb-0"
      sectionPadding="max-w-full"
    >
      <div
        ref={containerRef}
        className="relative flex justify-center w-full h-[600px] md:h-[700px]"
      >
        {dimensions.width > 0 && (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ cursor: "grab" }}
          >
            {nodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <g
                  key={node.name || i}
                  // 3. ROBUST FIX: Attach drag listener directly to the element when it mounts
                  ref={(nodeElement) => {
                     if (nodeElement) {
                       const s = d3.select(nodeElement);
                       s.datum(node); // Bind the data
                       s.call(drag);  // Attach the drag behavior
                     }
                  }}
                  className="bubble-node"
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleMouseEnter(e, node)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
                  onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
                >
                  <circle
                    r={node.radius}
                    fill="#1A1A1A"
                    stroke="#b0b0b0"
                    strokeWidth={2}
                    className="transition-all duration-200"
                    style={{
                      filter: hoveredNode === node
                        ? "drop-shadow(rgb(97, 218, 251) 0px 0px 8px)"
                        : "drop-shadow(rgb(97, 218, 251) 0px 0px 3px)",
                    }}
                  />
                  <foreignObject
                    x={-node.radius}
                    y={-node.radius}
                    width={node.radius * 2}
                    height={node.radius * 2}
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
                      {node.name && (
                        <span style={{ marginTop: 4 }}>{node.name}</span>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </SectionWrapper>
  );
};

export default SkillsBubbles;