import "./PrimitiveRootNode.css";

 function PrimitiveRootNode({ data }) {
  const { label, value } = data;
  return (
    <div className="primitive-root-node">
      <div className="primitive-root-node-label">{label}</div>
      <div className="primitive-root-node-value">{JSON.stringify(value)}</div>
    </div>
  );
}

export default PrimitiveRootNode;