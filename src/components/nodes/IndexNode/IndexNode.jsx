import "./IndexNode.css";
import { Handle,Position } from "@xyflow/react";
 function IndexNode({ data }) {
  const { label, value } = data;
  return (
    <div className="index-node">
      <div className="index-node-label">{label}</div>
      <div className="index-node-value">{JSON.stringify(value)}</div>
       <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default IndexNode;