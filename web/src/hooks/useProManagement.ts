import { useState } from 'react'
import { approvePro, rejectPro, type ProProfile } from '@/lib/api/profiles'

interface UseProManagementReturn {
  pendingPros: ProProfile[]
  approvedPros: ProProfile[]
  processingId: string | null
  error: string | null
  handleApprove: (id: string) => Promise<void>
  handleReject: (id: string, reason: string) => Promise<void>
}

export function useProManagement(
  initialPending: ProProfile[],
  initialApproved: ProProfile[]
): UseProManagementReturn {
  const [pendingPros, setPendingPros] = useState(initialPending)
  const [approvedPros, setApprovedPros] = useState(initialApproved)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (id: string): Promise<void> => {
    setProcessingId(id)
    setError(null)

    try {
      const approvedProfile = await approvePro(id)

      // Remove from pending
      setPendingPros(prev => prev.filter(pro => pro.id !== id))

      // Add to approved list
      setApprovedPros(prev => [...prev, approvedProfile])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve pro')
      throw err
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string, reason: string): Promise<void> => {
    setProcessingId(id)
    setError(null)

    try {
      await rejectPro(id, reason)

      // Remove from pending
      setPendingPros(prev => prev.filter(pro => pro.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject pro')
      throw err
    } finally {
      setProcessingId(null)
    }
  }

  return {
    pendingPros,
    approvedPros,
    processingId,
    error,
    handleApprove,
    handleReject,
  }
}
