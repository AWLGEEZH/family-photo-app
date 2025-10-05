import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, fetchProfile, joinFamily } = useAuth();
  const [children, setChildren] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    birthDate: '',
    relationship: 'child'
  });
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchChildren();
    fetchFamilyMembers();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/children`);
      setChildren(response.data.children);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/family`);
      setFamilyMembers(response.data.familyMembers || []);
    } catch (error) {
      console.error('Failed to fetch family members:', error);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/profile/children`, newChild);
      setNewChild({ name: '', birthDate: '', relationship: 'child' });
      setShowAddChild(false);
      setSuccess(`${newChild.relationship === 'pet' ? 'Pet' : 'Child'} added successfully!`);
      fetchChildren();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChild = async (childId) => {
    if (!window.confirm('Are you sure you want to remove this profile?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/profile/children/${childId}`);
      setSuccess('Profile removed successfully!');
      fetchChildren();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove child');
    }
  };

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await joinFamily(familyCode);

    if (result.success) {
      setSuccess('Successfully joined family!');
      setFamilyCode('');
      setShowJoinFamily(false);
      fetchProfile();
      fetchFamilyMembers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const copyFamilyCode = () => {
    navigator.clipboard.writeText(user.familyCode);
    setSuccess('Family code copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Family</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {user?.familyCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Your Family Code</h3>
                    <p className="text-lg font-mono text-blue-700">{user.familyCode}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Share this code with family members to invite them
                    </p>
                  </div>
                  <button
                    onClick={copyFamilyCode}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <ShareIcon className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
              </div>
            )}

            {!user?.familyCode && (
              <div className="mb-6">
                <button
                  onClick={() => setShowJoinFamily(!showJoinFamily)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Join Family</span>
                </button>

                {showJoinFamily && (
                  <form onSubmit={handleJoinFamily} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Family Code
                      </label>
                      <input
                        type="text"
                        value={familyCode}
                        onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                        placeholder="Enter family code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Joining...' : 'Join Family'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowJoinFamily(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Children & Pets</h3>
              <button
                onClick={() => setShowAddChild(!showAddChild)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {showAddChild && (
              <form onSubmit={handleAddChild} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newChild.name}
                      onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newChild.relationship}
                      onChange={(e) => setNewChild({ ...newChild, relationship: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="child">Child</option>
                      <option value="pet">Pet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newChild.birthDate}
                      onChange={(e) => setNewChild({ ...newChild, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddChild(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {children.map((child) => (
                <div key={child._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {child.profilePicture ? (
                        <img
                          src={child.profilePicture}
                          alt={child.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {child.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{child.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{child.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveChild(child._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {children.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No children or pets added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {familyMembers.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Family Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyMembers.map((member) => (
                <div key={member._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;