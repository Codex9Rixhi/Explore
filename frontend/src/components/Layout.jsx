import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Explore
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/recommendations" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Recommendations
                  </Link>
                  <Link to="/trips" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    My Trips
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Explore. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
