import { SignInButton } from "@/components/sign-in-button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commit Analyzer
          </h1>
          <p className="text-gray-600">
            Sign in to analyze your GitHub commits
          </p>
        </div>

        <SignInButton />

        <p className="text-center text-sm text-gray-600 mt-6">
          By signing in, you agree to analyze your commit history
        </p>
      </div>
    </div>
  );
}
