# CardinalSpace - Technical Implementation Guide

## 🏗️ System Architecture

### **Frontend Technology Stack**
```
React 18 + Next.js 14 + TypeScript
├── UI Framework: Tailwind CSS + shadcn/ui
├── State Management: React Hooks + Context API
├── Authentication: JWT + HTTP-Only Cookies
├── Real-time Updates: WebSocket + Server-Sent Events
├── Mobile Responsiveness: Responsive Design + PWA
└── Deployment: Vercel + Edge Functions
```

### **Backend Technology Stack**
```
Node.js + Next.js API Routes
├── Database: PostgreSQL + Prisma ORM
├── Authentication: JWT + bcryptjs
├── File Storage: Cloudinary (documents)
├── Payment Gateway: Stripe/PayMongo
├── Email Service: Resend/SendGrid
├── Real-time: WebSocket Server
└── Monitoring: Sentry + Analytics
```

---

## 🗄️ Database Schema

### **Core Tables**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  type ENUM('car', 'motorcycle', 'ev') DEFAULT 'car',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Parking Lots Table
CREATE TABLE parking_lots (
  id VARCHAR(10) PRIMARY KEY, -- 'A', 'B', 'C', 'D'
  name VARCHAR(255) NOT NULL,
  rows INTEGER NOT NULL,
  cols INTEGER NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Parking Spaces Table
CREATE TABLE parking_spaces (
  id VARCHAR(20) PRIMARY KEY, -- 'A-1', 'A-2', etc.
  lot_id VARCHAR(10) REFERENCES parking_lots(id),
  space_number INTEGER NOT NULL,
  row INTEGER NOT NULL,
  col INTEGER NOT NULL,
  is_covered BOOLEAN DEFAULT false,
  is_accessible BOOLEAN DEFAULT false,
  has_ev_charging BOOLEAN DEFAULT false,
  location_area VARCHAR(100),
  is_active BOOLEAN DEFAULT true
);

-- Reservations Table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  space_id VARCHAR(20) REFERENCES parking_spaces(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  qr_code VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permits Table
CREATE TABLE permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  permit_type ENUM('student', 'faculty', 'staff', 'visitor') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
  cost DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid') DEFAULT 'pending',
  qr_code VARCHAR(255),
  documents JSON, -- Array of uploaded document URLs
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Violations Table
CREATE TABLE violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  space_id VARCHAR(20) REFERENCES parking_spaces(id),
  violation_type ENUM('expired', 'wrong_space', 'no_permit', 'accessibility') NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  fine_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'appealed', 'resolved', 'dismissed') DEFAULT 'pending',
  evidence_photos JSON, -- Array of photo URLs
  notes TEXT,
  appeal_reason TEXT,
  appeal_status ENUM('pending', 'approved', 'rejected'),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reservation_id UUID REFERENCES reservations(id),
  permit_id UUID REFERENCES permits(id),
  violation_id UUID REFERENCES violations(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  refunded_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication & Security

### **JWT Implementation**
```typescript
// lib/auth-actions.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}
```

### **Middleware Protection**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth-actions';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes
  const publicRoutes = ['/portal/login', '/portal/signup', '/portal/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (!isPublicRoute && pathname.startsWith('/portal/')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    
    try {
      await verifyToken(token);
    } catch (error) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## 📡 Real-time Features

### **WebSocket Implementation**
```typescript
// lib/websocket.ts
import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join lot-specific room for real-time updates
      socket.on('join-lot', (lotId: string) => {
        socket.join(`lot-${lotId}`);
      });

      // Broadcast parking space updates
      socket.on('space-update', (data) => {
        io.to(`lot-${data.lotId}`).emit('space-changed', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  res.end();
}
```

### **Real-time Parking Updates**
```typescript
// app/api/parking/update/route.ts
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';

export async function POST(request: NextRequest) {
  const { spaceId, status, lotId } = await request.json();
  
  // Update database
  await updateSpaceStatus(spaceId, status);
  
  // Emit real-time update
  const io = global.io;
  if (io) {
    io.to(`lot-${lotId}`).emit('space-changed', {
      spaceId,
      status,
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.json({ success: true });
}
```

---

## 💳 Payment Integration

### **Stripe Integration**
```typescript
// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function createPaymentIntent(amount: number, currency: string = 'php') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Stripe error:', error);
    throw new Error('Failed to create payment intent');
  }
}
```

### **Payment Processing**
```typescript
// app/api/payments/process/route.ts
import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { createPayment } from '@/lib/database';

export async function POST(request: NextRequest) {
  const { reservationId, amount, paymentMethod } = await request.json();
  
  try {
    // Create Stripe payment intent
    const { clientSecret } = await createPaymentIntent(amount);
    
    // Create payment record
    const payment = await createPayment({
      reservationId,
      amount,
      paymentMethod,
      status: 'pending',
      stripeClientSecret: clientSecret,
    });
    
    return NextResponse.json({
      paymentId: payment.id,
      clientSecret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
```

---

## 📊 Analytics & Reporting

### **Usage Analytics**
```typescript
// lib/analytics.ts
export async function getParkingAnalytics(dateRange: { from: Date; to: Date }) {
  const analytics = await db.$queryRaw`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as total_reservations,
      SUM(total_amount) as total_revenue,
      AVG(EXTRACT(EPOCH FROM (end_time - start_time))/3600) as avg_duration_hours
    FROM reservations 
    WHERE created_at BETWEEN ${dateRange.from} AND ${dateRange.to}
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date DESC
  `;
  
  return analytics;
}

export async function getLotUtilization(lotId: string) {
  const utilization = await db.$queryRaw`
    SELECT 
      ps.lot_id,
      COUNT(*) as total_spaces,
      COUNT(CASE WHEN r.status = 'active' THEN 1 END) as occupied_spaces,
      ROUND(
        (COUNT(CASE WHEN r.status = 'active' THEN 1 END) * 100.0 / COUNT(*)), 
        2
      ) as utilization_percentage
    FROM parking_spaces ps
    LEFT JOIN reservations r ON ps.id = r.space_id 
      AND r.start_time <= NOW() 
      AND r.end_time >= NOW()
      AND r.status = 'active'
    WHERE ps.lot_id = ${lotId}
    GROUP BY ps.lot_id
  `;
  
  return utilization[0];
}
```

---

## 📱 Mobile PWA Features

### **Service Worker**
```javascript
// public/sw.js
const CACHE_NAME = 'cardinal-space-v1';
const urlsToCache = [
  '/',
  '/portal/dashboard',
  '/portal/map',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### **Push Notifications**
```typescript
// lib/notifications.ts
export async function sendPushNotification(userId: string, payload: any) {
  const subscription = await getUserPushSubscription(userId);
  
  if (subscription) {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  }
}

// Usage examples
await sendPushNotification(userId, {
  title: 'Reservation Expiring Soon',
  body: 'Your parking reservation expires in 30 minutes',
  icon: '/icons/parking-icon.png',
  actions: [
    { action: 'extend', title: 'Extend Reservation' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
});
```

---

## 🔧 Performance Optimization

### **Database Indexing**
```sql
-- Performance indexes
CREATE INDEX idx_reservations_user_time ON reservations(user_id, start_time);
CREATE INDEX idx_reservations_space_status ON reservations(space_id, status);
CREATE INDEX idx_violations_user_status ON violations(user_id, status);
CREATE INDEX idx_vehicles_user_primary ON vehicles(user_id, is_primary);
CREATE INDEX idx_permits_user_dates ON permits(user_id, start_date, end_date);
```

### **Caching Strategy**
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cacheParkingData(lotId: string, data: any) {
  await redis.setex(`parking:${lotId}`, 60, JSON.stringify(data)); // 60 seconds
}

export async function getCachedParkingData(lotId: string) {
  const cached = await redis.get(`parking:${lotId}`);
  return cached ? JSON.parse(cached) : null;
}
```

---

## 🚀 Deployment & Monitoring

### **Environment Variables**
```bash
# .env.local
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-jwt-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
RESEND_API_KEY="re_..."
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### **Vercel Configuration**
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" }
      ]
    }
  ]
}
```

### **Health Monitoring**
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        stripe: 'configured'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// __tests__/auth.test.ts
import { createToken, verifyToken } from '@/lib/auth-actions';

describe('Authentication', () => {
  test('should create and verify JWT token', async () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = await createToken(payload);
    const decoded = await verifyToken(token);
    
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });
});
```

### **Integration Tests**
```typescript
// __tests__/reservations.test.ts
import { POST } from '@/app/api/reservations/route';

describe('Reservations API', () => {
  test('should create reservation successfully', async () => {
    const request = new Request('http://localhost:3000/api/reservations', {
      method: 'POST',
      body: JSON.stringify({
        spaceId: 'A-1',
        startTime: '2024-03-12T10:00:00Z',
        endTime: '2024-03-12T14:00:00Z',
        vehicleId: 'vehicle-123'
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
  });
});
```

---

## 📈 Scaling Considerations

### **Database Optimization**
- **Read Replicas:** Separate read/write databases
- **Connection Pooling:** PgBouncer for connection management
- **Partitioning:** Time-based partitioning for reservations table

### **Microservices Architecture**
- **Auth Service:** Dedicated authentication microservice
- **Payment Service:** Isolated payment processing
- **Notification Service:** Separate notification handling
- **Analytics Service:** Dedicated analytics processing

### **CDN & Edge Computing**
- **Static Assets:** Cloudflare CDN for images, JS, CSS
- **Edge Functions:** Vercel Edge for geo-distributed API calls
- **Image Optimization:** Next.js Image optimization with CDN

---

## 🔒 Security Best Practices

### **Input Validation**
```typescript
// lib/validation.ts
import { z } from 'zod';

export const reservationSchema = z.object({
  spaceId: z.string().regex(/^[A-D]-\d+$/),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  vehicleId: z.string().uuid()
});

export const validateReservation = (data: unknown) => {
  return reservationSchema.parse(data);
};
```

### **Rate Limiting**
```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP'
});
```

### **Data Encryption**
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('cardinal-space', 'utf8'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}
```

---

## 🎯 Performance Metrics

### **Key Performance Indicators (KPIs)**
- **Page Load Time:** < 2 seconds for all pages
- **API Response Time:** < 500ms for 95% of requests
- **Database Query Time:** < 100ms for optimized queries
- **Mobile Performance:** Lighthouse score > 90
- **Uptime:** 99.9% availability target

### **Monitoring Tools**
- **Application Monitoring:** Sentry for error tracking
- **Performance Monitoring:** Vercel Analytics
- **Database Monitoring:** PgBouncer + pg_stat_statements
- **Real-time Monitoring:** Custom dashboard with WebSocket updates

---

This technical guide provides the foundation for building, deploying, and maintaining the CardinalSpace parking system at scale.
