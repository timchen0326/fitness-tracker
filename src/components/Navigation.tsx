'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, ChartBarIcon, CakeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Diet Tracker', href: '/diet', icon: CakeIcon },
    { name: 'Exercise', href: '/exercise', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const handleSignOut = async () => {
    try {
      await authSignOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                FitTrack
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive
                          ? 'border-b-2 border-indigo-500 text-gray-900'
                          : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-1" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 