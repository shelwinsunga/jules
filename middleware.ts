import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { init, tx, id } from '@instantdb/admin';


// const db = init({
//     appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || (() => { throw new Error('NEXT_PUBLIC_INSTANT_APP_ID is not set') })(),
//     adminToken: process.env.INSTANT_APP_ADMIN_TOKEN || (() => { throw new Error('INSTANT_APP_ADMIN_TOKEN is not set') })(),
// });
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/projects/:path*', '/project/:path*'],
}