import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import CallIcon from '@mui/icons-material/Call';
import { useLocation, useNavigate } from 'react-router';
import { Logout, getLoggedInUserDetails, isLoggedIn, logoutUser } from '../../backend_helper';
import SchoolIcon from '@mui/icons-material/School';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';




function NavbarComponent() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const pages =  isLoggedIn()  ? [{title:'Home',routeto:'/'} ,{title:'dashboard',routeto:'/dashboard'}] :[{title:'Login',routeto:'/login'},{title:"Register",routeto:"/register"}];
  const settings = ['Dashboard','Profile', 'Chat', 'Logout'];
  const {loggedInUser,invokeStateUpdate} = useContext(AuthContext);
  const location = useLocation();
 
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
        if(logoutUser()=="logged out successfully!"){
          invokeStateUpdate(false);
            navigate("/login");
        }else{
            alert("logout failed!");
        }


  }
  
  return (
    <AppBar position="sticky" sx={{
        backgroundColor:'black',
        
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'cursive',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OnlineSchool
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={()=>{
                    handleCloseNavMenu();
                    navigate(`${page.routeto}`)
                }}>
                  <Typography textAlign="center" color={location.pathname.toString() == page.routeto && 'blueviolet'} fontFamily="cursive">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'cursive',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OnlineSchool
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex',justifyContent:'flex-end' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={()=>{
                    handleCloseNavMenu();
                    navigate(`${page.routeto}`)
                }}
                sx={{ my: 2, color: 'white', display: 'flex',justifyContent:'center',alignItems:'center' }}
              >
                <Typography sx={{
                  textTransform:'none',
                  fontFamily:"cursive",

                }}
                color={location.pathname.toString() == page.routeto && 'cyan'}
                >
                {page.title}
                </Typography>
              </Button>
            ))}
          </Box>
                {
                    isLoggedIn() ? (
                        
          <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 ,marginLeft:5}}>
              {loggedInUser && <Avatar alt="Remy Sharp" src={loggedInUser.imageUrl ? loggedInUser.imageUrl : ""} />}
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
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                {setting === 'Logout' ? (
                    <Button onClick={handleLogout}  variant='outlined' color='secondary'><Typography textAlign="center">{setting}</Typography></Button>
                ):(
                    <Typography textAlign="center" fontFamily="cursive">{setting}</Typography>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
                    ):null
                }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavbarComponent;
