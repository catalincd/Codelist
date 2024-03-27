import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextButton from './TextButton';

const Dropdown = ({ name, items, value, onChangeHandle }) => {
    const [rootElement, setSootElement] = useState(null);
    const isSelected = Boolean(rootElement);


    const handleClick = (e) => setSootElement(e.currentTarget);
    const handleClose = (e) => setSootElement(null);
    const handleItemClick = (name, value) => {
        onChangeHandle(name, value);
        setSootElement(null);
    }

    return (
        <div className="dropdown">
            <TextButton text={name} onClickHandle={handleClick}/>
            <Menu className="languageMenu" anchorEl={rootElement} open={isSelected} onClose={handleClose}>
            {
                items.map((item, i) => <MenuItem className="languageMenuItem" key={i} onClick={() => handleItemClick(item.name, item.value)}>{item.name}</MenuItem>)
            }
            </Menu>
        </div>
    );
};

export default Dropdown
