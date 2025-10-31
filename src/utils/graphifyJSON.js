import { StepEdge } from "@xyflow/react";

//function to generate ids for graph node
const nextIdFactory = (()=>{
    let c = 0;
    return (prefix="n")=>
        typeof crypto!=="undefined" && crypto.UUID? crypto.UUID(): `${prefix}_${++c}`
})()

export  function graphifyJSON  (value,rootKey="root"){

   //initialise nodes,edges and nodeId
   const nodes = []
   const edges = []
   const nextId = nextIdFactory
   
   //helper functions to add node and add edges
   function addNode(node){
     nodes.push(node)
     return node.id
   }
   
   function addEdge(from,to){
    edges.push({
        id:`${from}_${to}`,
        source:from,
        target:to,
        type:StepEdge,
        animated:false
    })
   }

   function processObject(obj,path,level){
    const id = nextId("obj")
    const primitives = {}
    addNode({
        id,
        type:"objectNode",
        data:{path,label:path.split(".").slice(-1)[0]||"root",primitives},
        position:{x:level*200,y:nodes.length*20},
        level
    })

    for(const key of Object.keys(obj)){
        const val = obj[key]
        const childPath = path?`${path}.${key}`:key
        if(val===null||typeof val!=="object"){
            primitives[key] = val
        }
        else if(Array.isArray(val)){
            const arrId = nextId("arr")
            addNode({
                arrId,
                type:"arrNode",
                data:{path: childPath, label: `${key}[]`, length: val.length },
                position:{x:(level+1)*200,y:nodes.length*20},
                level:level+1
            });
            addEdge(id,arrId)

            val.forEach((el,idx)=>{
                const idxPath = `${childPath}[${idx}]`;
                if(el===null||typeof el!=="object"){
                    const idxId = nextId("idx")
                    addNode({
                        idxId,
                        type:"indexNode",
                        data:{path:idxPath,label:`[${idx}]`,value:el},
                        position:{x:(level+2)*200,y:nodes.length*20},
                        level:level+2
                    })
                }
                else{
                    const childId = processValue(el,idxPath,level+2)
                    addEdge(arrId,childId)
                }
            })
        }
            else{
                const childId = processValue(val,childPath,level+1)
                addEdge(id,childId)
            }
        }
        return id;
    }

    function processValue(val, path, level) {
    if (val === null || typeof val !== "object") {
      // primitive root
      const id = nextId("prim");
      addNode({
        id,
        type: "primitiveRootNode",
        data: { path, label: path.split(".").slice(-1)[0], value: val },
        position: { x: level * 200, y: nodes.length * 20 },
        level,
      });
      return id;
    }
    if (Array.isArray(val)) {
      const arrId = nextId("arr");
      addNode({
        id: arrId,
        type: "arrayNode",
        data: { path, label: `${path.split(".").slice(-1)[0] || "array"}[]`, length: val.length },
        position: { x: level * 200, y: nodes.length * 20 },
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
            position: { x: (level + 1) * 200, y: nodes.length * 20 },
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
    // object
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
