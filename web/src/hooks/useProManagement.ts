import { useState } from 'react'

interface PendingPro {
  id: number
  name: string
  title: string
  location: string
  email: string
  phone: string
  specialties: string[]
  tourExperience: string
  certifications: string[]
  appliedAt: string
  profileImage: string
}

interface ApprovedPro {
  id: number
  name: string
  title: string
  location: string
  status: 'active'
  profileViews: number
  leads: number
  matchedLessons: number
  rating: number
  subscriptionTier: 'basic' | 'pro'
}

interface UseProManagementReturn {
  pendingPros: PendingPro[]
  approvedPros: ApprovedPro[]
  processingId: number | null
  handleApprove: (id: number) => Promise<void>
  handleReject: (id: number) => Promise<void>
}

export function useProManagement(
  initialPending: PendingPro[],
  initialApproved: ApprovedPro[]
): UseProManagementReturn {
  const [pendingPros, setPendingPros] = useState(initialPending)
  const [approvedPros, setApprovedPros] = useState(initialApproved)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleApprove = async (id: number): Promise<void> => {
    setProcessingId(id)

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Remove from pending - approved pros are added to count but not shown immediately
    setPendingPros(prev => prev.filter(pro => pro.id !== id))

    // Increment approved count without showing the pro immediately
    setApprovedPros(prev => [...prev, {
      id: id + 1000, // Temporary ID to increment count without showing actual data
      name: '',
      title: '',
      location: '',
      status: 'active' as const,
      profileViews: 0,
      leads: 0,
      matchedLessons: 0,
      rating: 0,
      subscriptionTier: 'basic' as const,
    }])

    setProcessingId(null)
  }

  const handleReject = async (id: number): Promise<void> => {
    setProcessingId(id)

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Remove from pending
    setPendingPros(prev => prev.filter(pro => pro.id !== id))

    setProcessingId(null)
  }

  return {
    pendingPros,
    approvedPros,
    processingId,
    handleApprove,
    handleReject,
  }
}
