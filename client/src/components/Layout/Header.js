import * as React from 'react';
import {useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const settings = ['Logout'];

function Header () {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const userInitial = JSON?.parse( localStorage?.getItem( "user" ) )?.name?.charAt(0).toUpperCase(); // Parse the stored JSON string
  

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Add your logout functionality here
    handleCloseUserMenu();
    localStorage.removeItem("user");
    navigate("/login");
  };

  
  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Expense Tracker Title */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Expense Tracker
          </Typography>

          {/* Avatar on the right */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{userInitial}</Avatar>
                {/* src="/static/images/avatar/2.jpg"  */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* Logout Option */}
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { message } from "antd";

// const Header = () => {
//   const [loginUser, setLoginUser] = useState("");
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//       setLoginUser(user);
//     }
//   }, []);

//   const logoutHandler = () => {
//     localStorage.removeItem("user");
//     message.success("Logout Successfully");
//     navigate("/login");
//   };
//   return (
//     <>
//       <nav className="navbar navbar-expand-lg bg-light">
//         <div className="container-fluid">
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarTogglerDemo01"
//             aria-controls="navbarTogglerDemo01"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon" />
//           </button>
//           <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
//             <Link className="navbar-brand" to="/">
//               Expense Management
//             </Link>
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 {" "}
//                 <p className="nav-link">{loginUser && loginUser.name}</p>{" "}
//               </li>
//               <li className="nav-item">
//                 <button className="btn btn-primary" onClick={logoutHandler}>
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Header;