import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
)

export async function POST(req: NextRequest) {
  try {
    // Get user from auth token
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      console.error('No auth token found')
      return NextResponse.json(
        { error: 'No auth token found' },
        { status: 401 }
      )
    }

    let userId: string
    try {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
      )
      const verified = await jwtVerify(token, secret)
      console.log('Token verified:', verified.payload)
      userId = verified.payload.sub as string
      
      if (!userId) {
        console.error('No userId in token')
        return NextResponse.json(
          { error: 'No userId in token' },
          { status: 401 }
        )
      }
    } catch (error) {
      console.error('JWT verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { lot, space, startDate, endDate } = body

    if (!lot || !space || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        lot,
        space,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({
      id: reservation.id,
      lot: reservation.lot,
      space: reservation.space,
      startDate: reservation.startDate.toISOString().split('T')[0],
      endDate: reservation.endDate.toISOString().split('T')[0],
      status: 'active',
    })
  } catch (error) {
    console.error('Reservation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let userId: string
    try {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
      )
      const verified = await jwtVerify(token, secret)
      userId = verified.payload.sub as string
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(
      reservations.map((r) => ({
        id: r.id,
        lot: r.lot,
        space: r.space,
        startDate: r.startDate.toISOString().split('T')[0],
        endDate: r.endDate.toISOString().split('T')[0],
        status: r.status.toLowerCase(),
      }))
    )
  } catch (error) {
    console.error('Get reservations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
