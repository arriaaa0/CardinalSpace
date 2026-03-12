import { NextResponse, NextRequest } from "next/server"

// Simple in-memory test user
const testUser = {
  email: 'user@example.com',
  password: 'CardinalUser2024!',
  name: 'Test User',
  role: 'USER'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (action === 'login') {
      // Simple user login check
      if (email === testUser.email && password === testUser.password) {
        // Create a simple token (in production, use proper JWT)
        const token = Buffer.from(JSON.stringify({
          email: testUser.email,
          name: testUser.name,
          role: testUser.role
        })).toString('base64')
        
        const response = NextResponse.json({ 
          success: true, 
          role: testUser.role,
          user: {
            email: testUser.email,
            name: testUser.name,
            role: testUser.role
          }
        })
        
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
        })
        
        return response
      } else {
        return NextResponse.json({ 
          error: 'Invalid credentials' 
        }, { status: 401 })
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Simple user auth error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
