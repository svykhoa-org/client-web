import { Button, Modal } from 'antd'

interface IdlePromptProps {
  open: boolean
  onContinue: () => void
}

export function IdlePrompt({ open, onContinue }: IdlePromptProps) {
  return (
    <Modal
      open={open}
      title="Bạn còn đang học chứ?"
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="continue" type="primary" onClick={onContinue}>
          Tôi vẫn đang học
        </Button>,
      ]}
    >
      <p style={{ margin: 0 }}>
        Video đã tạm dừng vì không phát hiện thao tác. Nhấn nút bên dưới để tiếp tục học.
      </p>
    </Modal>
  )
}
