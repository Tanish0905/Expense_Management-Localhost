// install packages i reacct app i.e. expenseman.../client > npm i axios react-router-dom redux react react-redux
// npm i antd  library used in ui for design ( name :- ant design)
//check package.json file of client folder 

import React from 'react';
import { Route, Routes , Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from "./pages/Login";
function App() {
  return (
    <>
      <Routes>
        <Route
         path='/' 
         element={
         <ProtectedRoutes>
          <HomePage />
         </ProtectedRoutes>
         }
        />
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>

      </Routes>
    </>
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem('user')){
    return props.children;
  }else{
    return <Navigate to="/login" />;
  }
}
export default App;