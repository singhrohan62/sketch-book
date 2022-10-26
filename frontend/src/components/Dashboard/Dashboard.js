import './Dashboard.css';

import Header from './Header/Header';
import { Canvas } from './Canvas/Canvas';
import { useState, useEffect } from 'react';
import { Options } from './Options/Options';

import {
  getContributorsForSketch,
  getNamesOfAllSketches,
  getSketch,
  addSketch,
} from '../../APIs/Sketch';

import { CircularProgress, Backdrop } from '@mui/material';

export default function Dashboard({
  logOut,
  toastHandlerForPromises,
  loggedInUser,
}) {
  const [sketchMetaData, setSketchMetaData] = useState([]);

  const [currentSketch, setCurrentSketch] = useState();
  const [currentSketchMetaData, setCurrentSketchMetaData] = useState();
  const [sketchContributors, setSketchContributors] = useState([]);

  useEffect(() => {
    const preloadData = async () => {
      // get names of existing sketches and set current sketch: first sketch in the list
      if (!currentSketch) {
        const sketchNamesRes = await getNamesOfAllSketches();

        setSketchMetaData(sketchNamesRes.data);

        const currSketch = sketchNamesRes.data[0]; // Selecting the first sketch in the list
        setCurrentSketchMetaData(currSketch);

        if (currSketch && currSketch._id) {
          const sketchRes = await getSketch({ _id: currSketch._id });

          setCurrentSketch(sketchRes.data);

          // set Contributors list for current sketch
          const sketchContributorsRes = await getContributorsForSketch({
            _id: currSketch._id,
          });
          setSketchContributors(sketchContributorsRes.data);
        }
      } else {
        // to reset the states when the current sketch changes
        setCurrentSketchMetaData();
        setSketchContributors([]);
        const sketchNamesRes = await getNamesOfAllSketches();

        setSketchMetaData(sketchNamesRes.data);

        setCurrentSketchMetaData(currentSketch);

        // set Contributors list for current sketch
        const sketchContributorsRes = await getContributorsForSketch({
          _id: currentSketch._id,
        });
        setSketchContributors(sketchContributorsRes.data);
      }
    };
    preloadData();
  }, [currentSketch]);

  const handleSketchChange = (selectedSketch) => {
    const sketchPromise = getSketch({ _id: selectedSketch._id });
    toastHandlerForPromises(
      sketchPromise,
      `Loading sketch: ${selectedSketch.name}...`,
      `Loaded ${selectedSketch.name} successfully!`,
      `Could not load ${selectedSketch.name}. Something went wrong.`
    );
    sketchPromise.then((res) => {
      setCurrentSketch(res.data);
    });
  };

  const addSketchHandler = (sketch) => {
    const addSketchPromise = addSketch(sketch);
    toastHandlerForPromises(
      addSketchPromise,
      `Adding sketch: ${sketch.name}...`,
      `Added ${sketch.name} successfully!`,
      `Could not add ${sketch.name}. Something went wrong.`
    );

    addSketchPromise.then((res) => setCurrentSketch(res.data));
  };
  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      <Header user={loggedInUser} handleLogout={logOut} />
      {currentSketch && sketchContributors.length && sketchMetaData.length ? (
        <div className="main-content">
          <Canvas
            width={0.8 * window.innerWidth}
            height={0.85 * window.innerHeight}
            existingSketch={currentSketch}
            currentUser={loggedInUser}
            contributors={sketchContributors}
            toastHandlerForPromises={toastHandlerForPromises}
          />
          <Options
            style={{ width: '20vw' }}
            users={sketchContributors}
            sketches={sketchMetaData}
            currentUser={loggedInUser}
            currentSketchMD={currentSketchMetaData}
            addSketchHandler={addSketchHandler}
            handleSketchChange={handleSketchChange}
          />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </div>
  );
}
