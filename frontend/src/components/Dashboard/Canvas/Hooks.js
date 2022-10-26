import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

  // setting up refs for listeners
  const mouseMoveListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  useEffect(() => {
    function initMouseMoveListener() {
      const mouseMoveListener = (e) => {
        if (isDrawingRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY);
          const ctx = canvasRef.current.getContext("2d");
          // console.log(point);
          if (onDraw) onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
        }
      };
      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
    }

    function initMouseUpListener() {
      const listener = () => {
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };
      mouseUpListenerRef.current = listener;

      window.addEventListener("mouseup", listener);
    }

    function computePointInCanvas(clientX, clientY) {
      if (!canvasRef.current) return null;

      const boundingCanvas = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingCanvas.left,
        y: clientY - boundingCanvas.top
      };
    }

    function removeListeners() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    }

    initMouseMoveListener();
    initMouseUpListener();
    // console.log(canvasRef.current.getContext("2d"));
    return () => {
      removeListeners();
    };
  }, [onDraw]);

  function setCanvasRef(ref) {
    canvasRef.current = ref;
  }

  function onMouseDown() {
    isDrawingRef.current = true;
  }
  return { onMouseDown, setCanvasRef, canvasRef };
}
