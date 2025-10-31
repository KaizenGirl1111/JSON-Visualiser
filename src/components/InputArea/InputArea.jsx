import {useState,useEffect,useContext} from 'react'
import './InputArea.css'
import JSONErrorContext from '../../utils/JSONErrorContext';

function InputArea({leftPanelRef,obj,setObj}){

  const [text,setText]=useState(()=>JSON.stringify(obj,null,2));
  const [jsonError,setJsonError] = useContext(JSONErrorContext)

  const handleTextArea = (e)=>{
      const t = e.target.value;
      setText(t)
       try {
        const parsed = JSON.parse(t);
        setObj(parsed);     
        setJsonError(null);
      } catch (err) {
        setJsonError("You've entered invalid JSON format");
      }
    }
  
    useEffect(() => {
      setText(JSON.stringify(obj, null, 2));
    }, [obj]);
  
    return (
    <div ref={leftPanelRef} className="text-container">
      {console.log("error from input area",jsonError)}
     <textarea className="text-area" placeholder="Paste or type JSON here..." value={text} onChange={handleTextArea}/>
    </div>
    )

}

export default InputArea;