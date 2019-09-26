let stream;
let labeledFaceDescriptors;

function runFaceRecognition(sub, id) {
  const video = document.getElementById('video')
  navigator.getUserMedia(
    { video: {} },
    data => {
      video.srcObject = data
      stream = data
    },
    err => console.error(err)
  )

  video.addEventListener('play', async () => {
    sub.next(-1)
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
      if (detections[0]) {
        sub.next(1);
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach(result => {
          if (result.label === id) {
            sub.next(2)
          }
        })
      }
    }, 100)
  })

  return sub
}

async function loadLabeledImages(id) {
  const labels = [id]
  return Promise.all(
    labels.map(async label => {
      let descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  ).then(async data => labeledFaceDescriptors = data)
}

async function init() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/')
  ])
}

function stopVideo() {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
}