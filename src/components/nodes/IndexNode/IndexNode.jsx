import "./IndexNode.css";

 function IndexNode({ data }) {
  const { label, value, path } = data;
  return (
    <div className="index-node">
      <div className="index-node-label">{label}</div>
      <div className="index-node-value">{JSON.stringify(value)}</div>
      <div className="index-node-path">{path}</div>
    </div>
  );
}

export default IndexNode;