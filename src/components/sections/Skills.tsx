import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import SectionWrapper from "../common/SectionWrapper";
import { useContent } from "../../lib/contentContext";
import { getIconComponent } from "../../lib/iconMap";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

interface SkillNode extends d3.SimulationNodeDatum {
  name: string;
  icon: IconComponent;
  percent: number;
  desc: string;
  radius: number;
}

const SkillsBubbles: React.FC = () => {
  const { content } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Use only width in state, height is fixed
  const [width, setWidth] = useState(0);
  const [nodes, setNodes] = useState<SkillNode[]>([]);

  // Ref to store positions between re-renders to prevent "reset"
  const nodesRef = useRef<SkillNode[]>([]);

  const simulationRef = useRef<d3.Simulation<
    d3.SimulationNodeDatum,
    undefined
  > | null>(null);

  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);

  const skills = useMemo(
    () =>
      content.skills.map((s) => ({
        name: s.name,
        icon: getIconComponent(s.icon),
        percent: s.percent,
        desc: s.desc,
      })),
    [content.skills]
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drag = useMemo(() => {
    return d3
      .drag<SVGGElement, SkillNode>()
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
    // Set fixed height based on width (mobile/desktop)
    const isMobile = width < 640;
    const height = isMobile ? 600 : 720;
    if (width === 0) return;

    const minRadius = isMobile ? 25 : 35;
    const maxRadius = isMobile ? 60 : 100;

    const radiusScale = d3
      .scaleLinear()
      .domain([50, 100])
      .range([minRadius, maxRadius]);

    let currentNodes: SkillNode[] = [];

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
        d3.forceCollide<SkillNode>().radius((d) => d.radius + 6)
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
  }, [width, drag, skills]);

  const handleMouseEnter = (node: SkillNode) => {
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
      className="mb-0 !pb-0 !px-0"
      headingClass="mb-0"
      sectionPadding="max-w-full"
    >
      <div
        ref={containerRef}
        className="relative flex justify-center w-full h-[600px] md:h-[720px]"
      >
        {width > 0 && (
          <svg
            ref={svgRef}
            width={width}
            height={width < 640 ? 600 : 720}
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
                            fontSize: Math.max(8, node.radius * 0.2),
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
                              <span key={idx} style={{ marginBottom: 2, maxWidth: "100%", overflowWrap: "anywhere" }}>
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
