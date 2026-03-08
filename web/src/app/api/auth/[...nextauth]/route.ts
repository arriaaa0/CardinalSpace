import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'e8f7g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8'
)

async function createToken(userId: string, email: string, name: string) {
  const token = await new SignJWT({ 
    sub: userId,  // Standard JWT subject claim
    email, 
    name 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
  return token
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action') || 'login'

  try {
    const { email, password, name } = await request.json()

    if (action === 'signup') {
      // Create new user
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name }
      })

      const token = await createToken(user.id, user.email, user.name || '')
      
      const response = NextResponse.json({ success: true })
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })
      return response
    }

    // Login
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken(user.id, user.email, user.name || '')
    
    const response = NextResponse.json({ success: true, role: user.role })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint' })
}