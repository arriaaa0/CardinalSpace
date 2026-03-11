import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the auth token
    const response = NextResponse.json({ 
      success: true,
      message: "Logged out successfully"
    })
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
