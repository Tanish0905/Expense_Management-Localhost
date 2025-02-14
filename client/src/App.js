import React from 'react';
import { Route, Routes , Navigate } from "react-router-dom";

import Register from './pages/Register';
import Login from "./pages/Login";
import HomePageDashboard from './pages/HomePageDashboard';
import Layout from './components/Layout/Layout';
function App() {
  return (
    <>
      <Routes>
        <Route
         path='/HomePageDashboard' 
         element={
            <ProtectedRoutes>
              <Layout>
                <HomePageDashboard/>
              </Layout>
            </ProtectedRoutes>
         }
        />
        <Route path="*"
          element={
            <ProtectedRoutes>
              <Layout>
                <HomePageDashboard/>
              </Layout>
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