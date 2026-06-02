import { useEffect } from 'react'

import { TrophyFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import confetti from 'canvas-confetti'

interface CelebrationModalProps {
  open: boolean
  onClose: () => void
}

const fireFireworks = () => {
  const burst = (opts: confetti.Options) =>
    confetti({ zIndex: 9999, disableForReducedMotion: true, ...opts })

  const colors = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981']

  // Left cannon
  burst({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors,
  })
  // Right cannon
  burst({
    particleCount: 80,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.65 },
    colors,
  })
  // Center burst
  burst({
    particleCount: 60,
    spread: 100,
    origin: { x: 0.5, y: 0.6 },
    colors,
    startVelocity: 30,
    scalar: 1.1,
  })
  // Glitter shower
  burst({
    particleCount: 40,
    spread: 60,
    origin: { x: 0.5, y: 0.5 },
    colors,
    shapes: ['star'],
    scalar: 1.4,
    startVelocity: 45,
  })
}

export const CelebrationModal = ({ open, onClose }: CelebrationModalProps) => {
  useEffect(() => {
    if (!open) return
    // First burst immediately
    fireFireworks()
    // Second burst after 600ms for a layered effect
    const t = setTimeout(fireFireworks, 600)
    return () => clearTimeout(t)
  }, [open])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      styles={{ body: { padding: '32px 24px 24px', textAlign: 'center' } }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <TrophyFilled className="text-5xl text-amber-400" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            Chúc mừng bạn đã hoàn thành khoá học!
          </h2>
          <p className="text-sm text-gray-400">🎓 Bằng chứng nhận của bạn đã được cấp</p>
        </div>

        <blockquote className="mt-2 rounded-xl bg-blue-50 px-5 py-4 text-sm italic text-blue-700">
          "Tri thức là ngọn đuốc không bao giờ tắt —{' '}
          <span className="font-semibold">mỗi khoá học là một ngọn lửa mới bạn thắp lên.</span> Hãy
          tiếp tục toả sáng!"
        </blockquote>

        <Button type="primary" size="large" className="mt-2 w-full rounded-lg" onClick={onClose}>
          Tuyệt vời, tiếp tục thôi!
        </Button>
      </div>
    </Modal>
  )
}
