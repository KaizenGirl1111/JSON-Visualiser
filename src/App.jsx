import './App.css'
import SplitContainer from './components/SplitContainer/SplitContainer'
import Footer from './components/Footer/Footer'
import JSONErrorContext from './utils/JSONErrorContext'
import { useState } from 'react'
function App() {
 
  const [jsonError,setJsonError] = useState(null)
  
  return (
    <>
    <JSONErrorContext.Provider value={[jsonError,setJsonError]}>
    <div className="app-container">
      <SplitContainer/>
      <Footer/>
    </div>
    </JSONErrorContext.Provider>
    </>
  )
}

export default App
