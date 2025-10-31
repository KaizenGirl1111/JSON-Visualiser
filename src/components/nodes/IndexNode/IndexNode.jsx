import "./IndexNode.css";

 function IndexNode({ data }) {
  const { label, value } = data;
  return (
    <div className="index-node">
      <div className="index-node-label">{label}</div>
      <div className="index-node-value">{JSON.stringify(value)}</div>
    </div>
  );
}

export default IndexNode;