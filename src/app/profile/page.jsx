'use client';

import 'flatpickr/dist/flatpickr.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import useStore from '../store';

const Profile = () => {
  const router = useRouter();
  const { fetchedUser, fetchUserProfile, updateUserProfile } = useStore();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUserProfile();
        setEditedUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
      }
    };

    loadUser();
  }, [router, fetchUserProfile]);

  // Effect to update state when fetchedUser changes
  useEffect(() => {
    if (fetchedUser) {
      setEditedUser(fetchedUser);
    }
  }, [fetchedUser]);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(editedUser);
      setIsEditing(false);
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Something went wrong!');
    }
  };

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!fetchedUser)
    return <p className="text-center text-gray-600 mt-6">Loading...</p>;

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            {fetchedUser.name}
          </h2>
          <p className="text-gray-500 text-sm">{fetchedUser.email}</p>

          <div className="mt-4 text-left space-y-3">
            {/* Contact Field */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">
                Contact No.
              </span>
              {isEditing ? (
                <input
                  name="contact"
                  value={editedUser.contact || ''}
                  onChange={handleChange}
                  placeholder="Enter contact no."
                  className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-cyan-400"
                />
              ) : (
                <span className="text-gray-600">
                  {fetchedUser.contact ? fetchedUser.contact : 'N/A'}
                </span>
              )}
            </div>

            {/* Address Field */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Address</span>
              {isEditing ? (
                <input
                  name="address"
                  value={editedUser.address || ''}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-cyan-400"
                />
              ) : (
                <span className="text-gray-600">
                  {fetchedUser.address ? fetchedUser.address : 'N/A'}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:cursor-pointer mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 hover:cursor-pointer ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 hover:cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
