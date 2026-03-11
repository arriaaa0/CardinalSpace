import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({ 
        success: true,
        message: 'Password reset link sent to your email' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // In production, send email here
    // For now, just return success
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json({ 
      success: true,
      message: 'Password reset link sent to your email',
      // Remove this in production - only for testing
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
