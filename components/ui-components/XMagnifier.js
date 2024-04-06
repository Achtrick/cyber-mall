import { ZoomIn } from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import React, { useRef, useState } from "react";
import styles from "../../styles/components/XMagnifier.module.scss";
import { CloseIcon } from "../../utils/theme/icons";

function XMagnifier({ image, alt, ...props }) {
  const view = useRef(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - view.current.offsetLeft);
    setStartY(e.pageY - view.current.offsetTop);
    setScrollLeft(view.current.scrollLeft);
    setScrollTop(view.current.scrollTop);
    view.current.classList.add("grabbingCursor");
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    view.current.classList.remove("grabbingCursor");
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    view.current.classList.remove("grabbingCursor");
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - view.current.offsetLeft;
    const y = e.pageY - view.current.offsetTop;
    const moveX = x - startX;
    const moveY = y - startY;
    view.current.scrollLeft = scrollLeft - moveX;
    view.current.scrollTop = scrollTop - moveY;
  };

  const zoom = (e) => {
    if (!isMouseDown && startX == e.pageX - view.current.offsetLeft) {
      setZoomed(!zoomed);
      setTimeout(() => {
        document.getElementById("view").scrollTo({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          behavior: "instant",
        });
      }, 0);
    }
  };

  return (
    <>
      <Modal open={open}>
        <div
          id="view"
          ref={view}
          className={`${styles.view} + ${zoomed ? "grabCursor" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className={styles.magnify}>
            <IconButton
              style={{
                backgroundColor: "white",
                boxShadow: "0px 0px 5px #ccc",
              }}
              onClick={() => {
                setOpen(false);
                setZoomed(false);
              }}
              color="black"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <img
            src={`/api/images/${image.split("/").pop()}`}
            onError={(e) => {
              e.target.src = "/images/image-placeholder.jpg";
            }}
            alt={alt}
            style={{
              width: zoomed ? "200%" : "100%",
              height: zoomed ? "200%" : "100%",
              cursor: zoomed ? "zoom-out" : "zoom-in",
            }}
            onClick={zoom}
          />
        </div>
      </Modal>
      <div className={styles.container}>
        <div className={styles.magnify}>
          <IconButton
            onClick={() => setOpen(true)}
            style={{ backgroundColor: "white", boxShadow: "0px 0px 5px #ccc" }}
            color="black"
            size="small"
          >
            <ZoomIn />
          </IconButton>
        </div>
        {props.children}
      </div>
    </>
  );
}

export default XMagnifier;
