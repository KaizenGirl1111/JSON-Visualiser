import './ArrayNode.css'
function ArrayNode({ data }) {
const { label, length = 0 } = data;
return (
<div className="array-node-container">
<div className="array-label">{label}</div>
<div style={{ fontSize: 12, opacity: 0.8 }}>length: {length}</div>
</div>
);
}
export default ArrayNode;