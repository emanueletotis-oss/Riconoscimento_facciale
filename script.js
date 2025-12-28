const video = document.getElementById('video');
const btnTarget = document.getElementById('btnTarget');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const uploadTarget = document.getElementById('uploadTarget');
const modalError = document.getElementById('modalError');
const placeholder = document.getElementById('placeholder');

let targetDescriptor = null;
let detectionInterval;

// Carica i modelli di face-api.js
async function loadModels() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Modelli caricati");
}

loadModels();

// Gestione caricamento Target
btnTarget.onclick = () => uploadTarget.click();

uploadTarget.onchange = async () => {
    const file = uploadTarget.files[0];
    const image = await faceapi.bufferToImage(file);
    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
        modalError.style.display = 'flex';
        targetDescriptor = null;
    } else {
        targetDescriptor = detection.descriptor;
        alert("Target acquisito con successo!");
    }
};

document.getElementById('closeModal').onclick = () => modalError.style.display = 'none';

// Start Scansione
btnStart.onclick = async () => {
    if (!targetDescriptor) {
        alert("Carica prima un target!");
        return;
    }

    placeholder.style.display = 'none';
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    video.onplay = () => {
        const canvas = document.getElementById('overlay');
        const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
        faceapi.matchDimensions(canvas, displaySize);

        detectionInterval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const faceMatcher = new faceapi.FaceMatcher(targetDescriptor, 0.6);

            resizedDetections.forEach(detection => {
                const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                const box = detection.detection.box;

                if (bestMatch.label !== 'unknown') {
                    // MATCH TROVATO: Doppio riquadro Lawngreen
                    ctx.strokeStyle = 'rgb(124, 252, 0)';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                    ctx.lineWidth = 2;
                    ctx.strokeRect(box.x - 5, box.y - 5, box.width + 10, box.height + 10);
                    
                    // Ferma la ricerca degli altri (logica istruzioni)
                } else {
                    // VOLTO GENERICO: Riquadro Gold
                    ctx.strokeStyle = 'rgb(255, 215, 0)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                }
            });
        }, 100);
    };
};

// Stop
btnStop.onclick = () => {
    location.reload(); // Il modo più semplice per resettare tutto allo stato iniziale
};