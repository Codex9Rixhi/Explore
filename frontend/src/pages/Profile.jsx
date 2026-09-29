import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      
      <div className="bg-white shadow border rounded-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
            <p className="text-blue-100">{user.email}</p>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 border-b pb-4">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="col-span-2 text-gray-900">{user.name || 'Not provided'}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-4">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="col-span-2 text-gray-900">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-4">
              <span className="text-gray-500 font-medium">Role</span>
              <span className="col-span-2 text-gray-900 capitalize">{user.role || 'User'}</span>
            </div>
            <div className="grid grid-cols-3 pb-4">
              <span className="text-gray-500 font-medium">Joined</span>
              <span className="col-span-2 text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-md transition-colors border border-red-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
