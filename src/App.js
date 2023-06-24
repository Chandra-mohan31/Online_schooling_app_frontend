import React, { useContext } from 'react'
import { AuthContext } from './context/authContext'

function App() {
  //test 
  const {loggedInUser} = useContext(AuthContext);
  return (
    <div className='App'>{loggedInUser && loggedInUser.email}</div>
  )
}

export default App