// id factory (keeps your original intent; use crypto.randomUUID when available)
const nextIdFactory = (() => {
  let c = 0;
  return (prefix = "n") =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${prefix}_${++c}`;
})();

export function graphifyJSON(value, rootKey = "root") {
  const nodes = [];
  const edges = [];
  const nextId = nextIdFactory;

  function addNode(node) {
    if (!node.id) node.id = nextId("n");
    nodes.push(node);
    return node.id;
  }

  function addEdge(from, to) {
    edges.push({
      id: `${from}_${to}`,
      source: from,
      target: to,
    });
  }

  function processObject(obj, path, level) {
    const id = nextId("obj");
    const primitives = {};
    addNode({
      id,
      type: "objectNode",
      data: { path, label: path.split(".").slice(-1)[0] || "root", primitives },
      position: { x: level * 220, y: nodes.length * 90 },
      level,
    });

    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const childPath = path ? `${path}.${key}` : key;

      if (val === null || typeof val !== "object") {
        primitives[key] = val;
      } else if (Array.isArray(val)) {
        const arrId = nextId("arr");
        addNode({
          id: arrId, 
          type: "arrayNode", 
          data: { path: childPath, label: `${key}[]`, length: val.length },
          position: { x: (level + 1) * 220, y: nodes.length * 90 },
          level: level + 1,
        });
        addEdge(id, arrId);

        val.forEach((el, idx) => {
          const idxPath = `${childPath}[${idx}]`;
          if (el === null || typeof el !== "object") {
            const idxId = nextId("idx");
            addNode({
              id: idxId,
              type: "indexNode",
              data: { path: idxPath, label: `[${idx}]`, value: el },
              position: { x: (level + 2) * 220, y: nodes.length * 90 },
              level: level + 2,
            });
            addEdge(arrId, idxId);
          } else {
            const childId = processValue(el, idxPath, level + 2);
            addEdge(arrId, childId);
          }
        });
      } else {
        const childId = processValue(val, childPath, level + 1);
        addEdge(id, childId);
      }
    }
    return id;
  }

  function processValue(val, path, level) {
    if (val === null || typeof val !== "object") {
      const id = nextId("prim");
      addNode({
        id,
        type: "primitiveRootNode",
        data: { path, label: path.split(".").slice(-1)[0] || "value", value: val },
        position: { x: level * 220, y: nodes.length * 90 },
        level,
      });
      return id;
    }

    if (Array.isArray(val)) {
      const arrId = nextId("arr");
      addNode({
        id: arrId,
        type: "arrayNode", // keep consistent with nodeTypes
        data: { path, label: `${path.split(".").slice(-1)[0] || "array"}[]`, length: val.length },
        position: { x: level * 220, y: nodes.length * 90 },
        level,
      });

      val.forEach((el, idx) => {
        const idxPath = `${path}[${idx}]`;
        if (el === null || typeof el !== "object") {
          const idxId = nextId("idx");
          addNode({
            id: idxId,
            type: "indexNode",
            data: { path: idxPath, label: `[${idx}]`, value: el },
            position: { x: (level + 1) * 220, y: nodes.length * 90 },
            level: level + 1,
          });
          addEdge(arrId, idxId);
        } else {
          const childId = processValue(el, idxPath, level + 1);
          addEdge(arrId, childId);
        }
      });

      return arrId;
    }

    // fallback -> object
    return processObject(val, path, level);
  }

  processValue(value, rootKey === "" ? "" : rootKey, 0);
  return { nodes, edges };
}



   export function flattenToPathMap(obj, prefix = "") {
  const res = {};
  if (obj === null || typeof obj !== "object") {
    res[prefix] = obj;
    return res;
  }
  if (Array.isArray(obj)) {
    obj.forEach((el, i) => {
      Object.assign(res, flattenToPathMap(el, `${prefix}[${i}]`));
    });
    return res;
  }
  for (const k of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (obj[k] === null || typeof obj[k] !== "object") {
      res[path] = obj[k];
    } else {
      Object.assign(res, flattenToPathMap(obj[k], path));
    }
  }
  return res;
}
