import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

/* Жёсткая фиксация горизонтали: если браузер всё же сдвинул страницу
   влево/вправо (например, инерционный свайп на iOS), немедленно возвращаем к краю. */
const resetHorizontalScroll = () => {
  if (window.scrollX !== 0 || window.pageXOffset !== 0) {
    window.scrollTo(0, window.scrollY || window.pageYOffset);
  }
};
window.addEventListener("scroll", resetHorizontalScroll, { passive: true });
window.addEventListener("load", resetHorizontalScroll);
document.addEventListener("touchend", resetHorizontalScroll, { passive: true });
