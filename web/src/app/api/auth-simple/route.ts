import { NextResponse, NextRequest } from "next/server"

// Simple in-memory admin user for now
const adminUser = {
  email: 'admin@example.com',
  password: 'CardinalAdmin2024!',
  name: 'Admin User',
  role: 'ADMIN'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (action === 'login') {
      // Simple admin login check
      if (email === adminUser.email && password === adminUser.password) {
        // Create a simple token (in production, use proper JWT)
        const token = Buffer.from(JSON.stringify({
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role
        })).toString('base64')
        
        const response = NextResponse.json({ 
          success: true, 
          role: adminUser.role,
          user: {
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role
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
    console.error('Simple auth error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
