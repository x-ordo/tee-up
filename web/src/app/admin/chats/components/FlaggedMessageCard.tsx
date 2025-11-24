interface FlaggedMessage {
  id: number
  chatRoomId: number
  sender: string
  content: string
  flagReason: string
  flaggedAt: string
  status: string
}

interface FlaggedMessageCardProps {
  message: FlaggedMessage
  onAction: (id: number) => void
  onDismiss: (id: number) => void
  isProcessing: boolean
}

export function FlaggedMessageCard({ message, onAction, onDismiss, isProcessing }: FlaggedMessageCardProps) {
  return (
    <div className="card border-l-4 border-l-error">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="font-semibold text-calm-obsidian">{message.sender}</span>
              <span className="text-body-xs text-calm-ash">
                Chat Room #{message.chatRoomId}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                  message.status === 'pending'
                    ? 'bg-warning-bg text-warning'
                    : 'bg-info-bg text-info'
                }`}
              >
                {message.status === 'pending' ? '검토 대기' : '검토 완료'}
              </span>
            </div>
            <p className="mb-2 text-body-sm text-calm-ash">
              신고 사유: {message.flagReason}
            </p>
            <p className="text-body-xs text-calm-ash">신고 시각: {message.flaggedAt}</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-calm-stone bg-calm-cloud/50 p-4">
          <p className="text-body-sm text-calm-obsidian">&quot;{message.content}&quot;</p>
        </div>

        <div className="flex gap-3">
          <button
            className="btn-primary"
            onClick={() => onAction(message.id)}
            disabled={isProcessing}
          >
            조치
          </button>
          <button
            className="btn-ghost ml-auto"
            onClick={() => onDismiss(message.id)}
            disabled={isProcessing}
          >
            무시
          </button>
        </div>
      </div>
    </div>
  )
}
