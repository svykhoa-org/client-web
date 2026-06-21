import { useCallback, useEffect, useRef, useState } from 'react'

import { CameraOutlined } from '@ant-design/icons'
import { Alert, Button, Modal, Space, Spin } from 'antd'

interface ProctoringModalProps {
  open: boolean
  cameraRequired: boolean
  submitting: boolean
  onSubmit: (photo: Blob) => void
  onDecline: () => void
}

export function ProctoringModal({
  open,
  cameraRequired,
  submitting,
  onSubmit,
  onDecline,
}: ProctoringModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    setError(null)
    setStarting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
    } catch {
      setError('Không thể truy cập camera. Vui lòng cấp quyền camera để tiếp tục học.')
    } finally {
      setStarting(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      void startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [open, startCamera, stopCamera])

  const handleCapture = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      blob => {
        if (blob) onSubmit(blob)
      },
      'image/jpeg',
      0.85,
    )
  }, [onSubmit])

  const hasCamera = !!streamRef.current && !error

  return (
    <Modal
      open={open}
      title="Xác nhận bạn đang học"
      closable={!cameraRequired}
      maskClosable={false}
      keyboard={false}
      footer={null}
      onCancel={() => {
        if (!cameraRequired) onDecline()
      }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <p style={{ margin: 0 }}>
          Hệ thống cần xác nhận bạn vẫn đang theo dõi bài học. Vui lòng bật camera và chụp một ảnh
          để tiếp tục.
        </p>

        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {starting && <Spin style={{ position: 'absolute' }} />}
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message={error}
            action={
              <Button size="small" onClick={() => void startCamera()}>
                Thử lại
              </Button>
            }
          />
        )}

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          {!cameraRequired && (
            <Button onClick={onDecline} disabled={submitting}>
              Bỏ qua
            </Button>
          )}
          <Button
            type="primary"
            icon={<CameraOutlined />}
            loading={submitting}
            disabled={!hasCamera || starting}
            onClick={handleCapture}
          >
            Chụp & tiếp tục
          </Button>
        </Space>

        {cameraRequired && (
          <p style={{ margin: 0, fontSize: 12, color: '#8c8c8c' }}>
            Khoá học này yêu cầu bật camera. Bạn cần chụp ảnh xác nhận để có thể hoàn thành bài học.
          </p>
        )}
      </Space>
    </Modal>
  )
}
