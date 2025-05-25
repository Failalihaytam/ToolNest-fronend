import React, { useEffect, useState } from 'react';
import { updateProfile, getProfile } from '@/app/services/auth';
import { getCities, City } from '@/app/services/cities';
import { User, Mail, Phone, MapPin, Home } from 'react-feather';
import LoadingSpinner from '../ui/LoadingSpinner';

const EditProfile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    city_id: '',
    phone_number: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [cities, setCities] = useState<City[]>([]); // <-- Add type here
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, citiesRes] = await Promise.all([
          getProfile(),
          getCities(),
        ]);
        setForm({
          ...form,
          ...userRes.data,
          city_id: userRes.data.city_id || '',
          role: userRes.data.role || 'client',
        });
        setCities(citiesRes); // Now citiesRes is City[]
      } catch {
        setAlert({ type: 'error', message: 'Failed to load profile data.' });
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    try {
      await updateProfile(form);
      setAlert({ type: 'success', message: 'Profile updated successfully.' });
      setForm({ ...form, password: '', password_confirmation: '' });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && Object.values(err.response.data.errors).join(' ')) ||
        'Update failed.';
      setAlert({ type: 'error', message: msg });
    }
  };

  if (loading) return (
    <div className="flex justify-center p-8">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {alert.message && (
        <div className={`mb-6 p-4 rounded-lg ${
          alert.type === 'error' 
            ? 'bg-red-50 text-red-600 border border-red-200' 
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  name="username"
                  value={form.username || ''}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Choose a username"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Phone size={18} />
                </span>
                <input
                  name="phone_number"
                  type="tel"
                  value={form.phone_number || ''}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Home size={18} />
                </span>
                <input
                  name="address"
                  value={form.address || ''}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <MapPin size={18} />
                </span>
                <select
                  name="city_id"
                  value={form.city_id}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select your city</option>
                  {cities.map((city: City) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Leave blank to keep current"
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, password: '', password_confirmation: '' })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reset Changes
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;