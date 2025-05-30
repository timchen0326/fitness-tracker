import Image from 'next/image';
import Link from 'next/link';
import {
  ChartBarIcon,
  CakeIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Track Your Diet',
    description:
      'Log your meals and monitor your nutritional intake with detailed breakdowns of calories, protein, carbs, and fats.',
    icon: CakeIcon,
    href: '/diet',
  },
  {
    name: 'Smart Exercise Recommendations',
    description:
      'Get personalized AI-powered workout recommendations based on your available equipment and fitness goals.',
    icon: SparklesIcon,
    href: '/exercise',
  },
  {
    name: 'Monitor Progress',
    description:
      'Track your fitness journey with detailed statistics and visualizations of your progress over time.',
    icon: ChartBarIcon,
    href: '/dashboard',
  },
  {
    name: 'Personalized Goals',
    description:
      'Set and manage your fitness goals, dietary preferences, and receive customized recommendations.',
    icon: BoltIcon,
    href: '/profile',
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Track your fitness journey with AI-powered insights
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get personalized workout recommendations, track your meals, and achieve your fitness goals with our comprehensive fitness tracking platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signin"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <div className="relative overflow-hidden rounded-xl bg-gray-900 px-6 py-8 shadow-2xl sm:px-12 sm:py-16 md:px-16">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80"></div>
                <div className="relative">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      AI-Powered Workout Recommendations
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                      Get personalized workout plans based on your equipment, fitness level, and goals.
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Image
                      src="/workout-ai.jpg"
                      alt="AI Workout Recommendation"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A Complete Fitness Solution
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines diet tracking, AI-powered exercise recommendations, and progress
            monitoring to help you achieve your fitness goals.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-indigo-600"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
