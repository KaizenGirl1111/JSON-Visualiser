import {useCallback,useEffect,useState} from "react"

function Header(){
    // search & highlight: set node.data.highlight and selected, then center on first match
  const [query, setQuery] = useState("");
  const onSearch = useCallback(
    (q) => {
      const lower = (q || "").toLowerCase();
      setNodes((nds) =>
        nds.map((n) => {
          const path = (n.data?.path || "").toLowerCase();
          const isMatch = lower ? path.includes(lower) : false;
          return { ...n, data: { ...n.data, highlight: isMatch }, selected: isMatch };
        })
      );

      if (!lower) return;

      const match = nodes.find((n) => (n.data?.path || "").toLowerCase().includes(lower));
      if (match && rfInstanceRef.current) {
        const { x, y } = match.position || { x: 0, y: 0 };
        rfInstanceRef.current.setCenter(x, y, { duration: 400, zoom: 1.2 });
      }
    },
    [setNodes, nodes]
  );

  useEffect(() => onSearch(query), [query, onSearch]);

    return (
          <div style={{ position: "absolute", zIndex: 4, left: 12, top: 12 }} className="search-box">
          <input placeholder="Search path e.g. dependencies.react" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
    )
}

export default Header;