import React, { useCallback, useEffect, useMemo, useRef } from "react";
// @xyflow/react imports (per docs)
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import ObjectNode from "../nodes/ObjectNode/ObjectNode";
import ArrayNode from "../nodes/ArrayNode/ArrayNode";
import IndexNode from "../nodes/IndexNode/IndexNode";
import PrimitiveRootNode from "../nodes/PrimitiveRootNode/PrimitiveRootNode";
import { graphifyJSON } from "../../utils/graphifyJSON";

// NOTE: ensure applySimpleTreeLayout is defined/imported in this file or a util.
// import { applySimpleTreeLayout } from '../../utils/layout';
/* ----------------------
   nodeTypes for React Flow
   ---------------------- */
const nodeTypes = {
  objectNode: ObjectNode,
  arrayNode: ArrayNode,
  indexNode: IndexNode,
  primitiveRootNode: PrimitiveRootNode,
};

function GraphVisualiser() {
  const sample = useMemo(
    () => ({
      name: "jsontree",
      private: true,
      scripts: { dev: "next dev", build: "next build" },
      dependencies: {
        react: "18.2.0",
        "eslint-config-next": "^13.4.7",
        deep: { nested: 1, flag: true },
      },
      tags: ["ui", "visualizer"],
      misc: null,
      nums: [1, 2, { x: 5 }],
    }),
    []
  );

  // build raw nodes/edges
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => graphifyJSON(sample, "package.json"), [sample]);

  // create laidOut copies and apply layout
  const laidOut = useMemo(() => {
    const nodes = rawNodes.map((n) => ({ ...n }));
    const edges = rawEdges.map((e) => ({ ...e }));
    // filter edges that reference missing nodes (defensive)
    const idSet = new Set(nodes.map((n) => n.id));
    const filtered = edges.filter((e) => idSet.has(e.source) && idSet.has(e.target));
    // mark edges visible and smooth
    const safeEdges = filtered.map((e) => ({ ...e, type: "smoothstep", style: { stroke: "#60a5fa", strokeWidth: 2 } }));

    // ensure this util exists / import it if placed elsewhere
    if (typeof applySimpleTreeLayout === "function") {
      applySimpleTreeLayout(nodes, safeEdges, { direction: "LR", xGap: 260, yGap: 18, nodeHeight: 90 });
    } else {
      // fallback: leave positions as-is (you can import/apply your layout util)
      // console.warn("applySimpleTreeLayout not found — nodes will use default positions");
    }

    return { nodes, edges: safeEdges };
  }, [rawNodes, rawEdges]);

  const [nodes, setNodes, _onNodesStateChange] = useNodesState(laidOut.nodes);
  const [edges, setEdges, _onEdgesStateChange] = useEdgesState(laidOut.edges);

  const rfInstanceRef = useRef(null);
  const onInit = useCallback((instance) => (rfInstanceRef.current = instance), []);

  // re-run layout when raw graph changes
  useEffect(() => {
    const nodesCopy = rawNodes.map((n) => ({ ...n }));
    const edgesCopy = rawEdges.map((e) => ({ ...e }));
    const idSet = new Set(nodesCopy.map((n) => n.id));
    const filtered = edgesCopy.filter((e) => idSet.has(e.source) && idSet.has(e.target));
    const safeEdges = filtered.map((e) => ({ ...e, type: "smoothstep", style: { stroke: "#60a5fa", strokeWidth: 2 } }));
    if (typeof applySimpleTreeLayout === "function") {
      applySimpleTreeLayout(nodesCopy, safeEdges, { direction: "LR", xGap: 260, yGap: 18, nodeHeight: 90 });
    }
    setNodes(nodesCopy);
    setEdges(safeEdges);
  }, [rawNodes, rawEdges, setNodes, setEdges]);

  // THE documented pattern for onNodesChange / onEdgesChange:
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges]
  );

  // const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)), [setEdges]);

  return (
    <ReactFlowProvider>
      <div className="reactflow-wrapper" style={{ width: "100%", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onInit={onInit}
          attributionPosition="bottom-left"
        >
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
export default GraphVisualiser;
