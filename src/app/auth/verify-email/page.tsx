'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Check your email
        </h2>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">
            We sent you an email with a verification link. Please check your inbox and click the link to verify your account.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 