import React, { useEffect, useRef } from "react";
import "./SplitContainer.css";

function SplitContainer() {
  const isMouseDown = useRef(false);
  const leftPanelRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e) => {
    // left button only
    if (e.button !== 0) return;
    const leftPanel = leftPanelRef.current;
    if (!leftPanel) return;

    isMouseDown.current = true;
    startXRef.current = e.clientX;

    // read computed flex-basis (px)
    const styles = window.getComputedStyle(leftPanel);
    const flexBasis = styles.getPropertyValue("flex-basis") || styles.getPropertyValue("width");
    startWidthRef.current = Number.parseFloat(flexBasis) || leftPanel.getBoundingClientRect().width;

    // prevent selecting text while dragging
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

     function handleTouchStart(e){
        // initialize touch drag
        const touch = e.touches[0];
        if (!touch) return;
        isMouseDown.current = true;
        startXRef.current = touch.clientX;
        const leftPanel = leftPanelRef.current;
        const styles = window.getComputedStyle(leftPanel);
        const flexBasis = styles.getPropertyValue("flex-basis") || styles.getPropertyValue("width");
        startWidthRef.current = Number.parseFloat(flexBasis) || leftPanel.getBoundingClientRect().width;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";
        e.preventDefault();
      
    }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isMouseDown.current) return;
      const leftPanel = leftPanelRef.current;
      if (!leftPanel) return;

      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.max(120, startWidthRef.current + deltaX); // min width 120px
      leftPanel.style.flexBasis = `${newWidth}px`;
    }

    function handleMouseUp() {
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    function handleTouchMove(e) {
      if (!isMouseDown.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const leftPanel = leftPanelRef.current;
      const deltaX = touch.clientX - startXRef.current;
      const newWidth = Math.max(120, startWidthRef.current + deltaX);
      leftPanel.style.flexBasis = `${newWidth}px`;
      e.preventDefault();
    }

    function handleTouchEnd() {
      handleMouseUp();
    }
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div className="split-container">
      <div ref={leftPanelRef} className="text-container">
        <textarea className="text-area" placeholder="Paste or type JSON here..." />
      </div>

      <div className="divider" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} />

      <div className="tree-display">
        <div className="canvas-icon">{'{}'}</div>
      </div>
    </div>
  );
}

export default SplitContainer;
