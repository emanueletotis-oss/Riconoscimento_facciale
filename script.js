const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const inputTarget = document.getElementById('inputTarget');
const loadingInfo = document.getElementById('loadingInfo');
const popupError = document.getElementById('popupError');
const cameraIcon = document.getElementById('cameraIcon');

let targetDescriptor = null;
let faceMatcher = null;
let stream = null;
let isScanning = false;
let currentFacingMode = 'environment'; // Default fotocamera posteriore

async function init() {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        loadingInfo.innerText = "Sistema Pronto. Carica un Target.";
    } catch (e) {
        loadingInfo.innerText = "Errore caricamento modelli.";
    }
}
init();

document.getElementById('btnTarget').onclick = () => inputTarget.click();

inputTarget.onchange = async (e) => {
    loadingInfo.innerText = "Analisi Target...";
    const file = e.target.files[0];
    if (!file) return;

    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
        popupError.style.display = 'flex';
        targetDescriptor = null;
    } else {
        targetDescriptor = detection.descriptor;
        faceMatcher = new faceapi.FaceMatcher(targetDescriptor, 0.6);
        loadingInfo.innerText = "Target caricato. Premi Start.";
    }
};

document.getElementById('btnOk').onclick = () => popupError.style.display = 'none';

async function startCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: currentFacingMode } 
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Errore fotocamera: " + err);
    }
}

document.getElementById('btnStart').onclick = async () => {
    if (!targetDescriptor) {
        alert("Carica prima un target!");
        return;
    }
    cameraIcon.style.display = 'none';
    video.style.display = 'block';
    isScanning = true;
    await startCamera();
    
    video.onplay = () => {
        const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const loop = async () => {
            if (!isScanning) return;
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            resizedDetections.forEach(detection => {
                const match = faceMatcher.findBestMatch(detection.descriptor);
                const box = detection.detection.box;

                if (match.label !== 'unknown') {
                    // DOPPIO RIQUADRO LAWNGREEN
                    ctx.strokeStyle = 'rgb(124, 252, 0)';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                    ctx.lineWidth = 2;
                    ctx.strokeRect(box.x - 6, box.y - 6, box.width + 12, box.height + 12);
                } else {
                    // RIQUADRO GOLD
                    ctx.strokeStyle = 'rgb(255, 215, 0)';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                }
            });
            setTimeout(loop, 100);
        };
        loop();
    };
};

document.getElementById('btnSwitch').onclick = async () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    if (isScanning) {
        await startCamera();
    } else {
        alert("La fotocamera passerà a " + (currentFacingMode === 'user' ? 'frontale' : 'posteriore') + " all'avvio.");
    }
};

document.getElementById('btnStop').onclick = () => {
    location.reload();
};