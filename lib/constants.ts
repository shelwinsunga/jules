'use client'
import { init } from '@instantdb/react'

export const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string
export const db = init({ appId: APP_ID })
export const RAILWAY_ENDPOINT_URL = 'https://fastapi-production-6904.up.railway.app/';

