export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-8 text-sky-900 text-center">
          Login
        </h2>

        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-sky-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-sky-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-sky-900 text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-red-800 font-medium hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
