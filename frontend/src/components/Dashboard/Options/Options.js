import {
  Collapse,
  List,
  ListItemButton,
  Typography,
  Avatar,
  TextField,
  Button,
} from '@mui/material';

import './Options.css';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';

export const Options = ({
  users,
  sketches,
  currentUser,
  currentSketchMD,
  addSketchHandler,
  handleSketchChange,
}) => {
  const [showUsers, toggleUsersList] = useState(true);
  const [showSketches, toggleSketchesList] = useState(true);
  const [showAddSketchForm, toggleAddSketchForm] = useState(false);
  const [sketchName, setSketchName] = useState('');
  const [error, setError] = useState();

  const renderUsers = () => {
    if (!users) return <p>Users Not Found</p>;
    return users.map((user) => {
      return (
        <ListItemButton key={user._id}>
          <Avatar
            variant="rounded"
            sx={{
              width: '16px',
              height: '16px',
              margin: '8px',
              backgroundColor: `${user.color}`,
            }}
          >
            <CheckBoxOutlineBlankIcon />
          </Avatar>
          <Typography
            variant="body2"
            sx={user._id === currentUser._id ? { fontWeight: 'bolder' } : {}}
          >
            {' '}
            {user.firstName} {user.lastName}
          </Typography>
        </ListItemButton>
      );
    });
  };

  const renderSketchNames = sketches.map((sketch) => (
    <ListItemButton
      key={sketch._id}
      onClick={() => {
        if (sketch._id !== currentSketchMD._id) handleSketchChange(sketch);
      }}
    >
      <Typography
        variant="body2"
        className={sketch._id === currentSketchMD._id ? 'purple' : ''}
      >
        {sketch.name}
      </Typography>
    </ListItemButton>
  ));

  const handleAddSketch = () => {
    if (sketchName === '') {
      setError('Cannot be empty!');
      return;
    }
    const sketchSkeleton = {};
    sketchSkeleton.name = sketchName;
    sketchSkeleton.contents = [];
    sketchSkeleton.contents.push({ userid: currentUser._id, inputs: [] });
    addSketchHandler(sketchSkeleton);
    toggleAddSketchForm(false);
  };

  return (
    <div className="options-wrapper">
      <List>
        <ListItemButton
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onClick={() => {
            toggleUsersList(!showUsers);
          }}
        >
          <Typography variant="body1" className="montserrat">
            USERS
          </Typography>
          {showUsers ? (
            <KeyboardDoubleArrowUpIcon />
          ) : (
            <KeyboardDoubleArrowDownIcon />
          )}
        </ListItemButton>
        <Collapse in={showUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderUsers()}
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onClick={() => {
            toggleSketchesList(!showSketches);
          }}
        >
          <Typography variant="body1" className="montserrat">
            SKETCHES
          </Typography>
          {showSketches ? (
            <KeyboardDoubleArrowUpIcon />
          ) : (
            <KeyboardDoubleArrowDownIcon />
          )}
        </ListItemButton>
        <Collapse in={showSketches} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderSketchNames}
            {showAddSketchForm ? (
              <ListItemButton
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  size="small"
                  label="Sketch Name"
                  value={sketchName}
                  onChange={(e) => {
                    setSketchName(e.target.value);
                    if (e.target.value !== '') {
                      setError(null);
                    }
                  }}
                  error={error ? true : false}
                  helperText={error ? error : null}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    marginTop: '8px',
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      toggleAddSketchForm(false);
                    }}
                  >
                    <ClearIcon />
                    Clear
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    size="small"
                    onClick={handleAddSketch}
                  >
                    <AddIcon />
                    Add
                  </Button>
                </div>
              </ListItemButton>
            ) : (
              <ListItemButton
                sx={{ display: 'flex', justifyContent: 'space-evenly' }}
                onClick={() => {
                  toggleAddSketchForm(true);
                }}
              >
                <AddIcon />
                <Typography variant="body2" className="montserrat">
                  Add new sketch
                </Typography>
              </ListItemButton>
            )}
          </List>
        </Collapse>
      </List>
    </div>
  );
};
