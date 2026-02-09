import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { clinicReviewSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

// POST: Approve or reject clinic
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const supabase = createServerClient()

  try {
    const body = await request.json()
    const validated = clinicReviewSchema.parse(body)

    // Get existing clinic
    const { data: existingClinic } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Determine new status
    const newStatus = validated.action === 'approve' ? 'approved' : 'rejected'

    // Update clinic
    const updateData: any = {
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      reviewed_by: session.user.id,
    }

    if (validated.action === 'reject' && validated.rejection_reason) {
      updateData.rejection_reason = validated.rejection_reason
    } else if (validated.action === 'approve') {
      // Clear rejection reason if approving
      updateData.rejection_reason = null
    }

    const { data: clinic, error: updateError } = await supabase
      .from('clinics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to review clinic' }, { status: 500 })
    }

    // Log audit event
    await logAuditEvent(session.user.id, validated.action, 'clinic', id, {
      name: clinic.name,
      previousStatus: existingClinic.status,
      newStatus,
      rejection_reason: validated.rejection_reason || null,
    })

    return NextResponse.json({
      success: true,
      clinic,
      message: `Clinic ${validated.action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })
  } catch (error: any) {
    console.error('Review error:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to review clinic' }, { status: 500 })
  }
}
