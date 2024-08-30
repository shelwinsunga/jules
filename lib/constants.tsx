'use client'
import { init } from '@instantdb/react';

export const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string;
export const db = init({ appId: APP_ID });
