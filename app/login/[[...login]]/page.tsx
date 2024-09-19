'use client'
import {
  useAuth,
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/constants'
import { useEffect } from 'react'
import { tx } from '@instantdb/react'
import { SignIn, useUser } from '@clerk/nextjs'

const CLERK_CLIENT_NAME = 'clerk';


function ClerkSignedInComponent() {
  const { getToken, signOut } = useAuth();

  const signInToInstantWithClerkToken = async () => {
    // getToken gets the jwt from Clerk for your signed in user.
    const idToken = await getToken();

    if (!idToken) {
      // No jwt, can't sign in to instant
      return;
    }

    // Create a long-lived session with Instant for your clerk user
    // It will look up the user by email or create a new user with
    // the email address in the session token.
    db.auth.signInWithIdToken({
      clientName: CLERK_CLIENT_NAME,
      idToken: idToken,
    });
  };

  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error signing in to Instant! {error.message}</div>;
  }
  if (user) {
    return (
      <div>
        <p>Signed in with Instant through Clerk!</p>{' '}
        <button
          onClick={() => {
            // First sign out of Instant to clear the Instant session.
            db.auth.signOut().then(() => {
              // Then sign out of Clerk to clear the Clerk session.
              signOut();
            });
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={signInToInstantWithClerkToken}>
        Sign in to Instant
      </button>
    </div>
  );
}

export default function Login() {
  // const router = useRouter()
  // const { isLoading, user, error } = db.useAuth()

  // useEffect(() => {
  //   if (user) {
  //     const userProperties = Object.entries(user).reduce((acc, [key, value]) => {
  //       if (key !== 'id') {
  //         acc[key] = value;
  //       }
  //       return acc;
  //     }, {} as Record<string, any>);

  //     db.transact(tx.users[user.id].update(userProperties));
  //     router.push('/projects')
  //   }
  // }, [user, router]);

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <ClerkSignedInComponent />
      </SignedIn>
    </>
  );
}

function LoginForm() {
  const [sentEmail, setSentEmail] = useState('')
  return (
    <div className="flex justify-center items-center h-screen bg-background text-foreground">
      {!sentEmail ? <Email setSentEmail={setSentEmail} /> : <MagicCode sentEmail={sentEmail} />}
    </div>
  )
}

function Email({ setSentEmail }: { setSentEmail: (email: string) => void }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setSentEmail(email)
    db.auth.sendMagicCode({ email }).catch((err) => {
      alert('Uh oh :' + err.body?.message)
      setSentEmail('')
    })
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl">Let's log you in!</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">
            Send Code
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function MagicCode({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      alert('Uh oh :' + err.body?.message)
      setCode('')
    })
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl">Okay, we sent you an email! What was the code?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="123456..." value={code} onChange={(e) => setCode(e.target.value)} />
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
