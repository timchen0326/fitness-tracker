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
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <div className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  Latest Update
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>AI-Powered Workouts</span>
                </span>
              </div>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Personal Fitness Journey Starts Here
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Track your diet, get smart exercise recommendations, and achieve your fitness goals with
              our comprehensive fitness platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="/dashboard-preview.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
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
