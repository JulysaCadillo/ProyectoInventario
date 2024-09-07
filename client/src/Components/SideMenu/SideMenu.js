import React, {useState} from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import InventoryIcon from '@mui/icons-material/Inventory';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import {
  Button as MuiButton,
} from "@mui/material";

const SideMenu = () => {
  const [collpase, setCollpase] = useState(false);

  return (
    <Sidebar
        collapsed={collpase}
        breakPoint="md"
        backgroundColor={'azure'}
        rootStyles={{
          color: '#000', fontSize: 20 ,
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ flex: 1, marginTop: '60px' }} className="col-start-6 text-left bg-blue-500 p-2 rounded-md cursor-pointer">
            <MuiButton
                onClick={() => setCollpase(!collpase)}
                sx={{ color: '#000' }}
                className="flex flex-row justify-start items-center gap-4 !ml-2 "
            >
              <MenuIcon />
            </MuiButton>
            <Menu>
              <strong>
                <MenuItem icon={<HomeIcon />} 
                component={<Link to="/" />}> Panel</MenuItem>
                <MenuItem icon={<InventoryIcon />} 
                component={<Link to="/inventory" />}> Productos</MenuItem>
                <MenuItem icon={<CategoryIcon />} 
                component={<Link to="/category" />}> Categoria</MenuItem>
                <MenuItem icon={<LoyaltyIcon />} 
                component={<Link to="/orders" />}>Ordenes</MenuItem>
                <MenuItem icon={<StorefrontIcon />} 
                component={<Link to="/supplier" />}>Proveedor </MenuItem>
                <MenuItem icon={<GroupIcon />} 
                component={<Link to="/users" />}>Usuario </MenuItem>
              </strong>
            </Menu>
          </div>
        </div>
    </Sidebar>
  );
};

export default SideMenu;