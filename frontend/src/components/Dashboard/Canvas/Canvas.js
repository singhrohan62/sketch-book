import { useOnDraw } from './Hooks';
import { useState, useEffect, useTransition } from 'react';

import { saveSketch } from '../../../APIs/Sketch';

export const Canvas = ({
  width,
  height,
  existingSketch,
  currentUser,
  contributors,
  toastHandlerForPromises,
}) => {
  const [stylus, fillStylus] = useState([]);
  const [input, fillInput] = useState([]);

  const { onMouseDown, setCanvasRef, canvasRef } = useOnDraw(onDraw);
  let context =
    canvasRef && canvasRef.current ? canvasRef.current.getContext('2d') : null;

  useEffect(() => {
    // Clear the canvas before rendering anything
    if (!context) {
      context = canvasRef.current.getContext('2d');
    }
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (existingSketch && existingSketch.contents.length) {
      // If sketch had existing content,
      // Then we need to fill it on canvas
      existingSketch.contents.forEach((userContent) => {
        const userid = userContent.userid;
        let color = '#000'; //Default color
        contributors.forEach((user) => {
          if (user._id === userid) {
            color = user.color;
          }
        });
        userContent.inputs.forEach((scribble) => {
          scribble.forEach((point, idx) => {
            if (idx !== 0) {
              const prevPoint = scribble[idx - 1];
              drawLine(prevPoint, point, context, color, 3, true);
            }
          });
        });
      });
    }
  }, [context, existingSketch]);

  function onDraw(ctx, point, prevPoint) {
    const color = currentUser ? currentUser.color : '#bbb';

    drawLine(prevPoint, point, ctx, color, 3, false);
  }

  function drawLine(start, end, ctx, color, width, fillingExistingValues) {
    start = start ?? end;
    if (ctx) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(start.x, start.y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // TODO: save the point info. in a state variable
    // after mousedown event, save the info. in a
    // parent array

    if (!fillingExistingValues) {
      fillStylus([...stylus, end]);
    }
  }

  const handleMouseUp = () => {
    const userInput = stylus;

    // save the sketch input
    const reqBody = {};
    reqBody._id = existingSketch._id;
    reqBody.userid = currentUser._id;
    reqBody.input = userInput;
    const saveSketchPromise = saveSketch(reqBody);
    toastHandlerForPromises(
      saveSketchPromise,
      `Saving sketch: ${existingSketch.name}...`,
      `Saved ${existingSketch.name} successfully!`,
      `Could not save ${existingSketch.name}. Something went wrong.`
    );
    saveSketchPromise.then((res) => {
      // Update the UI only after it gets successfully saved
      fillInput([...input, stylus]);
      fillStylus([]);
    });
  };

  return (
    <canvas
      width={width}
      height={height}
      style={canvasStyle}
      ref={setCanvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

const canvasStyle = {
  backgroundColor: 'white',
};
