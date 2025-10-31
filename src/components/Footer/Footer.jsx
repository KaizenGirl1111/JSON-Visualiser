import './Footer.css'
import JSONErrorContext from '../../utils/JSONErrorContext';
import {useContext} from 'react'

function Footer(){
   const [jsonError,setJsonError] = useContext(JSONErrorContext) 

  return (
    <div className="footer" style={{color:jsonError?"red":"green"}}>
      {jsonError!==null?jsonError:"Valid JSON format"}
    </div>
  );
}

export default Footer;