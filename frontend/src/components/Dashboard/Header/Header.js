import './Header.css';
import {
  Divider,
  Avatar,
  Typography,
  Popover,
  ListItemButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';

import { useState } from 'react';

export default function Header(props) {
  const [showPopover, togglePopover] = useState(false);

  if (!props || !props.user) {
    return (
      <>
        <div className="header-wrap">
          <p>"SketchBook"</p>
        </div>
        <Divider />
      </>
    );
  }

  // return first letter of first, mid(if exists) and last
  const getAvatarText = (user) => {
    if (user) {
      let avatarText =
        (user.firstName.charAt(0) || '') + (user.lastName.charAt(0) || '');
      return avatarText.toUpperCase();
    } else {
      return 'N/A'; // means that user data wasn't provided to Header
    }
  };

  const avatarText = getAvatarText(props.user);
  const avatarBg = props.user.color;
  return (
    <>
      <div className="header-wrap">
        <div className="text-wrap">
          <Typography variant="h6" className="montserrat">
            {props.user.firstName} {props.user.lastName}
          </Typography>
        </div>
        <Avatar
          sx={{ height: '32px', width: '32px', backgroundColor: `${avatarBg}` }}
        >
          {avatarText}
        </Avatar>
        <MoreVertIcon
          onClick={() => {
            togglePopover(!showPopover);
          }}
        />
        <Popover
          open={showPopover}
          onClose={() => {
            togglePopover(false);
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <ListItemButton onClick={props.handleLogout}>
            Logout <LogoutIcon sx={{ ml: 1 }} />
          </ListItemButton>
        </Popover>
      </div>
      <Divider />
    </>
  );
}
