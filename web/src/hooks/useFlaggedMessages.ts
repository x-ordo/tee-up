import { useState } from 'react'

interface FlaggedMessage {
  id: number
  chatRoomId: number
  sender: string
  content: string
  flagReason: string
  flaggedAt: string
  status: string
}

interface UseFlaggedMessagesReturn {
  flaggedMessages: FlaggedMessage[]
  processingId: number | null
  handleAction: (id: number) => Promise<void>
  handleDismiss: (id: number) => Promise<void>
}

export function useFlaggedMessages(initialMessages: FlaggedMessage[]): UseFlaggedMessagesReturn {
  const [flaggedMessages, setFlaggedMessages] = useState(initialMessages)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleAction = async (id: number): Promise<void> => {
    setProcessingId(id)

    // Simulate async operation (e.g., ban user, delete message)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Remove from flagged list
    setFlaggedMessages(prev => prev.filter(msg => msg.id !== id))

    setProcessingId(null)
  }

  const handleDismiss = async (id: number): Promise<void> => {
    setProcessingId(id)

    // Simulate async operation (mark as reviewed)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Remove from flagged list
    setFlaggedMessages(prev => prev.filter(msg => msg.id !== id))

    setProcessingId(null)
  }

  return {
    flaggedMessages,
    processingId,
    handleAction,
    handleDismiss,
  }
}
