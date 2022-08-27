import Image from 'next/image';
import styles from './AppBar.module.css';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import LogoutIcon from '@mui/icons-material/Logout';
import { NoSsr } from '@mui/material';
import { IconButton } from '@mui/material';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function AppBar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const cookies = parseCookies()
  const [user, setUser] = useState(cookies.userId)
  const [name, setName] = useState(cookies.name !== 'null' && cookies.name !== "undefined" && cookies.name !== undefined ? cookies.name : cookies.userId)
  const [image, setImage] = useState(cookies.image !== 'null' && cookies.image !== "undefined" && cookies.image !== undefined ? cookies.image : '/tv-show.png')
  const [isfirstLogin, setIsfirstLogin] = useState(cookies.isfirstLogin !== 'null' && cookies.isfirstLogin !== "undefined" && cookies.isfirstLogin !== undefined ? cookies.isfirstLogin : true)

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, path) => {
    handleClose();
    router.push(path);
  }

  const handleLogout = () => {
    destroyCookie(null, 'userId')
    destroyCookie(null, 'name')
    destroyCookie(null, 'image')
    destroyCookie(null, 'isfirstLogin')
    router.replace('/')
    router.reload()
  }

  return (
    <div className={styles.appbar}>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        บริการอื่นๆ
      </Button>
      <NoSsr>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          visibility: user && isfirstLogin == "false" ? 'visible' : 'hidden',
        }}>
          <Button onClick={() => {
            router.push('/profile')
          }}>
            <Image src={image} alt="logo" width={30} height={30} style={
              {
                borderRadius: '50%',
              }} />
            &nbsp;{name}
          </Button>
          <div style={
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
          }>
            {/* <Button variant="outlined" startIcon={<LogoutIcon />} size="small" color="primary" onClick={handleLogout}>ออก</Button> */}
            <IconButton size="small" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </div>
      </NoSsr>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={(e) => {
          handleMenuItemClick(e, '/')
        }}>
          {/* <EditIcon /> */}
          ระบบรับออเดอร์
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleMenuItemClick(e, '/booking')
        }}>
          {/* <FileCopyIcon /> */}
          ระบบจองที่พัก (pre-alpha)
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleMenuItemClick(e, '/stock')
        }}>
          {/* <FileCopyIcon /> */}
          ระบบสต็อกสินค้า (pre-alpha)
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleMenuItemClick(e, '/todo')
        }}>
          {/* <FileCopyIcon /> */}
          Todo List (beta)
        </MenuItem>
        {/* <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleClose} disableRipple>
                    <ArchiveIcon />
                    Archive
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <MoreHorizIcon />
                    More
                </MenuItem> */}
      </StyledMenu>
    </div >
  )
}