/* Sfondo generale dell'app */
body {
    background-color: rgb(248, 248, 255); [cite_start]/* ghostwhite [cite: 16] */
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
}

.header {
    width: 100%;
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    z-index: 10;
}

.controls {
    display: flex;
    gap: 10px;
}

/* Stile pulsanti migliorato */
button {
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold; [cite_start]/* grassetto [cite: 17, 18] */
    border-radius: 10px;
    border: 2px solid black; [cite_start]/* contorno nero [cite: 17, 18] */
    color: black; [cite_start]/* scritte nere [cite: 17, 18] */
    box-shadow: 0 4px 0px rgba(0,0,0,0.2);
    transition: all 0.1s active;
}

button:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0px rgba(0,0,0,0.2);
}

#targetBtn { background-color: rgb(218, 165, 32); [cite_start]} /* goldenrod [cite: 17] */
#startBtn { background-color: rgb(50, 205, 50); [cite_start]}  /* limegreen [cite: 18] */
#stopBtn { background-color: rgb(220, 20, 60); [cite_start]}   /* crimson [cite: 18] */

/* Riquadro scansione */
#cameraContainer {
    position: relative;
    width: 90vw;
    height: 70vh;
    background-color: rgb(220, 220, 220); [cite_start]/* gainsboro [cite: 16] */
    border: 2px solid black; [cite_start]/* contorno nero [cite: 16] */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
}

#placeholder {
    position: absolute;
    display: flex;
    z-index: 1;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
    display: none;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    pointer-events: none;
}

/* Popup Errore */
#errorPopup {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: rgb(248, 248, 255); [cite_start]/* ghostwhite [cite: 23] */
    border: 4px solid rgb(220, 20, 60); [cite_start]/* crimson [cite: 23] */
    color: rgb(220, 20, 60); [cite_start]/* crimson [cite: 23] */
    padding: 30px;
    text-align: center;
    border-radius: 15px;
}

.hidden { display: none !important; }