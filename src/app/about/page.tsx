export default function About() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About FitTrack
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            FitTrack is your all-in-one fitness companion, designed to help you achieve your health and
            wellness goals through smart technology and personalized guidance.
          </p>

          <div className="mt-10 space-y-8 text-base leading-7 text-gray-600">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              <p className="mt-4">
                We believe that everyone deserves access to personalized fitness guidance. Our mission
                is to make health and fitness tracking simple, intuitive, and effective by combining
                cutting-edge AI technology with proven fitness principles.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li className="flex gap-x-3">
                  <span className="text-indigo-600">•</span>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Comprehensive Diet Tracking
                    </strong>{' '}
                    - Log your meals and monitor nutritional intake with detailed breakdowns.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-indigo-600">•</span>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      AI Exercise Recommendations
                    </strong>{' '}
                    - Get personalized workout suggestions based on your available equipment and goals.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-indigo-600">•</span>
                  <span>
                    <strong className="font-semibold text-gray-900">Progress Tracking</strong> -
                    Visualize your journey with detailed statistics and progress indicators.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-indigo-600">•</span>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Customizable Experience
                    </strong>{' '}
                    - Set your preferences, dietary restrictions, and fitness goals for a personalized
                    experience.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Technology</h3>
              <p className="mt-4">
                Built with modern web technologies including Next.js, Supabase, and OpenAI, FitTrack
                delivers a seamless and responsive experience across all devices. Our AI-powered
                recommendations use advanced machine learning to provide personalized workout
                suggestions based on your specific circumstances and goals.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Privacy & Security</h3>
              <p className="mt-4">
                Your privacy and data security are our top priorities. All personal information is
                encrypted and stored securely. We never share your data with third parties without
                your explicit consent.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900">Get Started</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Ready to begin your fitness journey? Create an account today and experience the power of
              personalized fitness tracking and AI-powered recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 