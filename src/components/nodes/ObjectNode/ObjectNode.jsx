import {useState} from 'react'
function ObjectNode({data}){
   const {label,primitives={},path} = data;
   const [open,setOpen] = useState(false)
    return(
        <div className="object-node-container">
            <div className="object-node-header">
               <div className="object-label">{label}</div>
               <div className="object-path">{path}</div>
            </div>
                 <div style={{ marginTop: 6 }}>
        {Object.keys(primitives).length === 0 ? (
          <div className="placeholder">No primitives</div>
        ) : (
          <>
            <div className="object-node-content">
              <div className="node-size">{Object.keys(primitives).length} items</div>
              <button onClick={() => setOpen(s => !s)} style={{ cursor: "pointer" }}>
                {open ? "collapse" : "expand"}
              </button>
            </div>
            {open && (
              <div className="primitives-list">
                {Object.entries(primitives).map(([k, v]) => (
                  <div key={k}><strong>{k}</strong>: {JSON.stringify(v)}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
        </div>
    )
}

export default ObjectNode;