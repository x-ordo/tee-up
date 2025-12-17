import { FlaggedMessage } from '@/hooks/useFlaggedMessages'

interface FlaggedMessageCardProps {
  message: FlaggedMessage
  onAction: (id: string) => void
  onDismiss: (id: string) => void
  isProcessing: boolean
}

export function FlaggedMessageCard({
  message,
  onAction,
  onDismiss,
  isProcessing,
}: FlaggedMessageCardProps) {
  return (
    <div className="card border-l-4 border-l-error">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="font-semibold text-tee-ink-strong">{message.sender}</span>
              <span className="text-body-xs text-tee-ink-muted">
                Chat Room #{message.chatRoomId.slice(0, 8)}
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
            <p className="mb-2 text-body-sm text-tee-ink-muted">신고 사유: {message.flagReason}</p>
            <p className="text-body-xs text-tee-ink-muted">신고 시각: {message.flaggedAt}</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-tee-stone bg-tee-surface/50 p-4">
          <p className="text-body-sm text-tee-ink-strong">&quot;{message.content}&quot;</p>
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
