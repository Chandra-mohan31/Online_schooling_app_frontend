import { Person } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { isLoggedIn, logoutUser } from '../../backend_helper';
import { AuthContext } from '../../context/authContext';




function NavbarComponent() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const pages =  isLoggedIn()  ? [{title:'dashboard',routeto:'/dashboard'},{title:'studymaterials',routeto:'/studymaterials'},{title:'assignments',routeto:'/assignments'}] :[{title:'Login',routeto:'/login'},{title:"Register",routeto:"/register"}];
  const settings = [{title: 'Dashboard',routeto:'/dashboard'},{ title:'Profile',routeto:'/profile',icon:<Person />}, {title:'Logout'}];
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
        backgroundColor:'#1F6E8C',
        
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
              fontFamily: 'Arial',
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
                  <Typography textAlign="center" color={location.pathname.toString() == page.routeto && 'blueviolet'} fontFamily="Arial">{page.title}</Typography>
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
              fontFamily: 'Arial',
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
                  fontFamily:"Arial",

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
            
          <Tooltip title={`${loggedInUser && loggedInUser.userName}`}>
          <Box sx={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center'
          }}>
            {/* <Typography variant='body1'>{loggedInUser && loggedInUser.userName}</Typography> */}
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 ,marginLeft:5}}>
              {loggedInUser && <Avatar alt={loggedInUser?.userName} src={loggedInUser.imageUrl ? loggedInUser.imageUrl : ""} />}
            </IconButton>
          </Box>
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
              <MenuItem key={setting.title} onClick={handleCloseUserMenu}>
                {setting.title === 'Logout' ? (
                    <Button onClick={handleLogout}  variant='outlined' color='secondary'><Typography textAlign="center">{setting.title}</Typography></Button>
                ):(
                    
                      <Link style={{
                      textDecoration:'none',
                      display:'flex',
                      flexDirection:'row',
                      justifyContent:'space-between',
                      alignItems:'center'
                    }} to={setting.routeto}>
                      {
                        setting.icon && <IconButton>
                          {setting.icon}
                        </IconButton>
                      }
                      <Typography textAlign="center" fontFamily="Arial">{setting.title}</Typography></Link>
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
