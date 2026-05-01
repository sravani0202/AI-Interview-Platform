import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as faceapi from 'face-api.js'
import api from '../services/api'

const VideoRecordingScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [mediaURL, setMediaURL] = useState('')
  const [loading, setLoading] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [faceSnapshot, setFaceSnapshot] = useState('')
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const mediaRecorderRef = useRef(null)
  const mediaChunksRef = useRef([])
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const faceDetectionIntervalRef = useRef(null)

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models from GitHub Pages (reliable for face-api.js)
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/'
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        console.log('Face detection models loaded successfully')
        setModelsLoaded(true)
      } catch (error) {
        console.error('Error loading face detection models:', error)
        console.log('Face detection models failed to load. Please check your internet connection.')
      }
    }
    loadModels()
  }, [])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current)
      }
    }
  }, [])

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || !videoRef.current.videoWidth) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const displaySize = { width: video.videoWidth, height: video.videoHeight }
    faceapi.matchDimensions(canvas, displaySize)

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 }))
      console.log('Face detections:', detections)

      if (detections) {
        setFaceDetected(true)
        if (!faceSnapshot) {
          captureFaceSnapshot()
        }
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        
        // Draw bounding box
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        const box = resizedDetections.detection.box
        ctx.strokeRect(box.x, box.y, box.width, box.height)

        // Draw label
        ctx.fillStyle = '#00ff00'
        ctx.font = 'bold 16px Arial'
        ctx.fillText('Face Detected', box.x, box.y - 10)
      } else {
        setFaceDetected(false)
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }
  }

  const startFaceDetection = () => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current)
    }
    console.log('Starting face detection')
    faceDetectionIntervalRef.current = setInterval(detectFace, 100)
  }

  const stopFaceDetection = () => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current)
    }
    setFaceDetected(false)
  }

  const captureFaceSnapshot = () => {
    if (!videoRef.current) return
    const snapshotCanvas = document.createElement('canvas')
    snapshotCanvas.width = videoRef.current.videoWidth
    snapshotCanvas.height = videoRef.current.videoHeight
    const ctx = snapshotCanvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, snapshotCanvas.width, snapshotCanvas.height)
    setFaceSnapshot(snapshotCanvas.toDataURL('image/png'))
  }

  const startRecording = async () => {
    try {
      if (!modelsLoaded) {
        alert('Face detection models are still loading. Please wait...')
        return
      }

      setFaceSnapshot('')
      setFaceDetected(false)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      streamRef.current = stream

      videoRef.current.onloadedmetadata = async () => {
        await videoRef.current.play().catch(() => {})
        // Start face detection after video is ready
        startFaceDetection()
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        mediaChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          mediaChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const mediaBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' })
          const url = URL.createObjectURL(mediaBlob)
          setMediaURL(url)
          stopFaceDetection()
        }

        mediaRecorder.start()
        setIsRecording(true)
      }

      videoRef.current.srcObject = stream
    } catch (error) {
      alert('Error accessing camera and microphone. Please check permissions.')
      stopFaceDetection()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      stopFaceDetection()
      setIsRecording(false)
    }
  }

  const handleSubmit = async () => {
    if (!mediaURL) {
      alert('Please record your answer first')
      return
    }

    if (!faceSnapshot) {
      alert('Face capture is required. Make sure your face is visible on the webcam and try again.')
      return
    }

    setLoading(true)
    try {
      const mediaBlob = await fetch(mediaURL).then(r => r.blob())
      const formData = new FormData()
      formData.append('media', mediaBlob, 'answer.webm')

      await api.post(`/interviews/${id}/submit-media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate(`/results/${id}`)
    } catch (error) {
      alert('Failed to submit recording')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Video Recording</h1>

        <div className="mb-8 p-4 sm:p-6 bg-blue-50 rounded-lg text-center">
          <div className="text-4xl sm:text-6xl mb-4">🎥</div>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">Click record to start your video response with face detection</p>

          <div className="mb-4 relative inline-block w-full max-w-sm sm:max-w-md">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full border-2 border-gray-300 rounded"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full border-2 border-gray-300 rounded pointer-events-none"
              style={{ display: isRecording ? 'block' : 'none' }}
            />
          </div>

          <div className="mb-4">
            <div className={`inline-block px-4 py-2 rounded text-white text-sm sm:text-base ${
              faceDetected ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {faceDetected ? '✓ Face Detected' : '✗ No Face Detected'}
            </div>
          </div>

          {faceSnapshot && (
            <div className="mb-4 text-left">
              <p className="text-sm sm:text-base text-gray-700 mb-2">Captured face snapshot:</p>
              <img src={faceSnapshot} alt="Captured face" className="w-40 h-40 object-cover rounded-lg border border-gray-200" />
            </div>
          )}

          <div className="mb-4">
            {!modelsLoaded && (
              <p className="text-yellow-600">Loading face detection models...</p>
            )}
            {modelsLoaded && !isRecording && (
              <p className="text-sm text-gray-600">Webcam is required and face detection must succeed before you can submit.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={startRecording}
              disabled={isRecording || !modelsLoaded}
              className="px-4 sm:px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm sm:text-base"
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>

            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="px-4 sm:px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 text-sm sm:text-base"
            >
              Stop Recording
            </button>
          </div>

          {mediaURL && (
            <div className="mt-6">
              <p className="text-gray-600 mb-2 text-sm sm:text-base">Preview your recording:</p>
              <video controls src={mediaURL} className="w-full max-w-sm sm:max-w-md mx-auto" />
              <button
                onClick={() => setMediaURL('')}
                className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm sm:text-base"
              >
                Re-record
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !mediaURL}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 text-sm sm:text-base"
        >
          {loading ? 'Submitting...' : 'Submit Recording'}
        </button>
      </div>
    </div>
  )
}

export default VideoRecordingScreen
