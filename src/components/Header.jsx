import { useState } from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const HeaderContainer = styled.div`
    display: grid;
    grid-template-columns: 300px auto 200px;
    align-items: center;
    padding: 5px 20px;
    height: 60px;
    border-bottom: 1px solid lightgray;
`;

const HeaderLogo = styled.div`
    display: flex;
    align-items: center;
    img {
        width: 40px;
    }
    span {
        font-size: 22px;
        margin-left: 10px;
        color: gray;
    }
`;

const HeaderSearch = styled.div`
    display: flex;
    align-items: center;
    width: 700px;
    background-color: whitesmoke;
    padding: 12px;
    border-radius: 10px;
    input {
        background-color: transparent;
        border: 0;
        outline: 0;
        flex: 1;
    }
`;

const HeaderIcons = styled.div`
    display: flex;
    align-items: center;
    span {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    svg.MuiSvgIcon-root {
        margin: 0px 10px;
    }
`;

const Header = ({ photoURL, searchTerm, setSearchTerm, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        onLogout(); // Call the logout function passed as a prop
        handleCloseMenu();
    };

    return (
        <HeaderContainer>
            <HeaderLogo>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
                    alt="Google Drive"
                />
                <span>Drive</span>
            </HeaderLogo>
            <HeaderSearch>
                <SearchIcon />
                <input
                    type="text"
                    placeholder="Search in Drive"
                    value={searchTerm} // Bind the value to searchTerm state
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                />
                <FormatAlignCenterIcon />
            </HeaderSearch>
            <HeaderIcons>
                <span>
                    <HelpOutlineIcon />
                    <SettingsIcon />
                </span>
                <span>
                    <AppsIcon />
                    <Avatar src={photoURL} onClick={handleMenuClick} />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </span>
            </HeaderIcons>
        </HeaderContainer>
    );
};

export default Header;
