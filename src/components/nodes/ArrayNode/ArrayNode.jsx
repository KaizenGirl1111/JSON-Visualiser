import './ArrayNode.css'
import { Handle,Position } from '@xyflow/react';
function ArrayNode({ data }) {
const { label, length = 0 } = data;
return (
<div className="array-node-container">
<div className="array-label">{label}</div>
<div className="array-length">length: {length}</div>
 <Handle type="source" position={Position.Right} />
 <Handle type="target" position={Position.Left} />
</div>
);
}
export default ArrayNode;