import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import SectionWrapper from "../common/SectionWrapper";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaCloud,
  FaLinux,
  FaLock,
} from "react-icons/fa";
import {
  SiMongodb,
  SiTensorflow,
  SiTailwindcss,
  SiExpress,
  SiPostgresql,
  SiRedux,
  SiGithubactions,
  SiJavascript,
  SiGit,
  SiTypescript,
  SiRedis,
  SiPandas,
} from "react-icons/si";

const SkillsBubbles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<any[]>([]);

  // Ref to store positions between re-renders to prevent "reset"
  const nodesRef = useRef<any[]>([]);

  const simulationRef = useRef<d3.Simulation<
    d3.SimulationNodeDatum,
    undefined
  > | null>(null);

  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const skills = useMemo(
    () => [
      { name: "React", icon: FaReact, percent: 95, desc: ["Hooks", "Context", "SPA"] },
      { name: "JavaScript", icon: SiJavascript, percent: 90, desc: ["ES6+", "Async", "Event loop"] },
      { name: "TypeScript", icon: SiTypescript, percent: 75, desc: ["Interfaces", "Generics", "Types"] },
      { name: "TailwindCSS", icon: SiTailwindcss, percent: 80, desc: ["Rapid UI"] },
      { name: "Redux", icon: SiRedux, percent: 75, desc: ["Thunk", "Slices", "State Mgmt"] },
      { name: "Node.js", icon: FaNodeJs, percent: 90, desc: ["High Perf APIs"] },
      { name: "Python", icon: FaPython, percent: 95, desc: ["Data & ML Workflows", "Automation"] },
      { name: "Express.js", icon: SiExpress, percent: 85, desc: ["REST APIs", "Middleware"] },
      { name: "MongoDB", icon: SiMongodb, percent: 80, desc: ["Aggregation", "Indexing"] },
      { name: "Relational DBs", icon: SiPostgresql, percent: 75, desc: ["Postgres", "MySQL"] },
      { name: "Caching", icon: SiRedis, percent: 60, desc: ["Redis", "Memcached", "Session Store"] },
      { name: "Data Science", icon: SiPandas, percent: 80, desc: ["ETL", "Feature Eng", "ML Pipelines"] },
      { name: "Deep Learning", icon: SiTensorflow, percent: 75, desc: ["CNNs", "Transformers", "LLMs"] },
      { name: "Cloud", icon: FaCloud, percent: 65, desc: ["AWS S3", "Firebase", "Oracle Cloud"] },
      { name: "Docker", icon: FaDocker, percent: 65, desc: ["Containerization"] },
      { name: "CI-CD", icon: SiGithubactions, percent: 50, desc: ["GitHub Actions", "Jenkins"] },
      { name: "OS - Server", icon: FaLinux, percent: 70, desc: ["Linux", "Nginx"] },
      { name: "Security", icon: FaLock, percent: 65, desc: ["JWT", "Bcrypt", "CORS"] },
      { name: "Git", icon: SiGit, percent: 80, desc: ["Branching", "Code Reviews", "Collab"] },
    ],
    []
  );

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

  const drag = useMemo(() => {
    return d3
      .drag<SVGGElement, any>()
      .on("start", (event, d) => {
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

    let currentNodes: any[] = [];

    if (nodesRef.current.length === skills.length) {
      currentNodes = skills.map((s, i) => {
        const existingNode = nodesRef.current[i];
        return {
          ...existingNode,
          ...s,
          radius: radiusScale(s.percent),
        };
      });
    } else {
      currentNodes = skills.map((s, i) => ({
        ...s,
        radius: radiusScale(s.percent),
        x: width / 2,
        y: height / 2,
        index: i,
      }));
    }

    const simulation = d3
      .forceSimulation(currentNodes)
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
      simulation
        .force("x", d3.forceX(width / 2).strength(0.3))
        .force("y", d3.forceY(height / 2).strength(0.08));
    }

    simulation.on("tick", () => {
      setNodes([...currentNodes]);
      nodesRef.current = currentNodes;
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [dimensions, drag, skills]);

  const handleMouseEnter = (node: any) => {
    setHoveredNode(node);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <SectionWrapper
      id="skills"
      title="Skills & Technologies"
      subtitle="Floating Bubble Cluster"
      className="mb-0 pb-0 px-0"
      headingClass="mb-0"
      sectionPadding="max-w-full"
    >
      <div
        ref={containerRef}
        className="relative flex justify-center w-full h-[600px] md:h-[720px]"
      >
        {dimensions.width > 0 && (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ cursor: "grab" }}
            className="touch-pan-y" 
          >
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node;

              return (
                <g
                  key={node.name || i}
                  ref={(nodeElement) => {
                    if (nodeElement) {
                      const s = d3.select(nodeElement);
                      s.datum(node);
                      s.call(drag);
                    }
                  }}
                  className="bubble-node touch-none" 
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => handleMouseEnter(node)}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.cursor = "grabbing")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
                >
                  <circle
                    r={node.radius}
                    fill="#1A1A1A"
                    stroke="#b0b0b0"
                    strokeWidth={2}
                    className="transition-all duration-300 ease-in-out"
                    style={{
                      filter: isHovered
                        ? "drop-shadow(rgb(97, 218, 251) 0px 0px 8px)"
                        : "drop-shadow(rgb(97, 218, 251) 0px 0px 3px)",
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
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        color: "white",
                        textAlign: "center",
                        userSelect: "none",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Default View */}
                      <div
                        className="transition-opacity duration-300 absolute inset-0 flex flex-col items-center justify-center"
                        style={{
                          opacity: isHovered ? 0 : 1,
                          transform: isHovered ? "scale(0.8)" : "scale(1)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <span
                          style={{ fontSize: node.radius * 0.7, lineHeight: 1 }}
                        >
                          {Icon && <Icon />}
                        </span>
                        {node.name && (
                          <span
                            style={{
                              marginTop: 4,
                              fontSize: Math.max(10, node.radius * 0.18),
                            }}
                          >
                            {node.name}
                          </span>
                        )}
                      </div>

                      {/* Hover View */}
                      <div
                        className="transition-opacity duration-300 absolute inset-0 flex items-center justify-center px-2"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? "scale(1)" : "scale(1.2)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div
                          style={{
                            fontSize: Math.max(11, node.radius * 0.25),
                            fontWeight: "bold",
                            wordWrap: "break-word",
                            lineHeight: 1.2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {Array.isArray(node.desc) &&
                            node.desc.map((line: string, idx: number) => (
                              <span key={idx} style={{ marginBottom: 2 }}>
                                {line}
                              </span>
                            ))}
                        </div>
                      </div>
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