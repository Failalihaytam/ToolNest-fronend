"use client"

import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronLeft, Upload } from 'react-feather';
import { toast } from 'react-hot-toast';
import { getCategories, getCities, createListing } from '@/app/services/listingService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const today = new Date();
const thirtyDaysFromNow = new Date();
thirtyDaysFromNow.setDate(today.getDate() + 30);

type ListingFormState = {
  title: string;
  description: string;
  price_per_day: string;
  category_id: string;
  city_id: string;
  delivery_option: boolean;
  start_date: string;
  end_date: string;
  is_premium: boolean;
  premium_duration: string;
  main_photo: File | null;
  additional_photos: (File | null)[];
};

const initialState: ListingFormState = {
  title: '',
  description: '',
  price_per_day: '',
  category_id: '',
  city_id: '',
  delivery_option: false,
  start_date: '',
  end_date: '',
  is_premium: false,
  premium_duration: '1',
  main_photo: null,
  additional_photos: Array(5).fill(null),
};

const CreateListingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        // Fetch categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.status === 'success' && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch cities
        const citiesResponse = await getCities();
        if (citiesResponse.status === 'success' && citiesResponse.data) {
          setCities(citiesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load categories and cities. Please try again.');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index = -1) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (index === -1) {
      setForm((prev) => ({ ...prev, main_photo: file }));
    } else {
      setForm((prev) => {
        const newPhotos = [...prev.additional_photos];
        newPhotos[index] = file;
        return { ...prev, additional_photos: newPhotos };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validate dates
  if (new Date(form.start_date) > new Date(form.end_date)) {
    setError('End date must be after start date');
    setLoading(false);
    return;
  }
  
  try {
    const formData = new FormData();
    // Add form fields to formData
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price_per_day', form.price_per_day.toString());
    formData.append('category_id', form.category_id);
    formData.append('city_id', form.city_id);
    formData.append('delivery_option', form.delivery_option ? '1' : '0');
    
    // Add availability period
    formData.append('start_date', form.start_date);
    formData.append('end_date', form.end_date);
    
    // Add premium options if selected
    formData.append('is_premium', form.is_premium ? '1' : '0');
    if (form.is_premium) {
      formData.append('premium_duration', form.premium_duration);
    }
    
    // Add main photo (ensure it's not null)
    if (form.main_photo) {
      formData.append('images[]', form.main_photo);
    } else {
      setError('Main photo is required');
      setLoading(false);
      return;
    }
    
    // Add additional photos
    form.additional_photos.forEach(photo => {
      if (photo) {
        formData.append('images[]', photo);
      }
    });
    
    // Call our API service
    const response = await createListing(formData);
    
    if (response.status === 'success') {
      // Show success message
      toast.success('Listing created successfully!');
      navigate('/partner-dashboard');
    } else {
      // Show detailed validation errors if available
      if (response.errors) {
        const errorMessages = Object.values(response.errors).flat().join('\n');
        setError(errorMessages || response.message || 'Failed to create listing');
      } else {
        setError(response.message || 'Failed to create listing');
      }
    }
  } catch (err: any) {
    console.error('Form submission error:', err);
    if (err.response?.data?.errors) {
      const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
      setError(errorMessages);
    } else {
      setError(err.message || 'An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};

  // Sous-menu items
  const steps = [
    { id: 'details', label: 'Tool Details', step: 0 },
    { id: 'pricing', label: 'Pricing & Availability', step: 1 },
    { id: 'photos', label: 'Photos', step: 2 }
  ];

  const renderStepContent = (step: number) => {
  switch (step) {
    case 0:
      return (
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Tool Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="tn-input w-full"
              placeholder="e.g., Bosch GSB 18V-55 Impact Drill"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="tn-input w-full"
            required
          >
            <option value="">Select a category</option>
            {fetchingData ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            )}
          </select>
          </div>
          <div>
          <label className="block font-semibold mb-1">City</label>
          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className="tn-input w-full"
            required
          >
            <option value="">Select a city</option>
            {fetchingData ? (
              <option disabled>Loading cities...</option>
            ) : (
              cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))
            )}
          </select>
        </div>
      </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="tn-input w-full"
              rows={4}
              placeholder="Describe your tool in detail..."
              required
            />
          </div>
        </div>
      );
    case 1:
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price and Delivery section */}
        <div>
          <label className="block font-semibold mb-1">Price per day (€)</label>
          <input
            type="number"
            name="price_per_day"
            value={form.price_per_day}
            onChange={handleChange}
            className="tn-input w-full"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Delivery Option</label>
          <div className="flex items-center h-full">
            <input
              type="checkbox"
              name="delivery_option"
              checked={form.delivery_option}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Delivery Available</span>
          </div>
        </div>
      </div>

      {/* Improved Dates section with better labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">
            Available From <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="tn-input w-full"
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            First day this tool will be available for rent
          </p>
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Available Until <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="tn-input w-full"
            min={form.start_date || new Date().toISOString().split('T')[0]}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Last day this tool will be available for rent
          </p>
        </div>
      </div>

      {/* Availability visualization */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Availability Period</h4>
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm">Available</span>
          </div>
          <span className="mx-4 text-gray-400">•</span>
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="ml-2 text-sm">Unavailable</span>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          {form.start_date && form.end_date ? (
            <p>
              Your tool will be available for <strong>{
                Math.ceil((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / (1000 * 60 * 60 * 24))
              } days</strong>, from <strong>{new Date(form.start_date).toLocaleDateString()}</strong> to <strong>{new Date(form.end_date).toLocaleDateString()}</strong>
            </p>
          ) : (
            <p className="text-yellow-500">Please select both start and end dates</p>
          )}
        </div>
      </div>

      {/* Premium section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Premium Listing Options</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Premium listings appear at the top of search results, increasing visibility and rental chances.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 flex items-center">
              <input
                type="checkbox"
                name="is_premium"
                checked={form.is_premium}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Promote this listing</span>
            </label>
          </div>
          
          {form.is_premium && (
            <div>
              <label className="block font-semibold mb-1">Premium Duration</label>
              <select
                name="premium_duration"
                value={form.premium_duration}
                onChange={handleChange}
                className="tn-input w-full"
                required={form.is_premium}
              >
                <option value="1">1 month - Best value (Priority 1)</option>
                <option value="2">2 weeks (Priority 2)</option>
                <option value="3">1 week (Priority 3)</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
    case 2:
      return (
        <div className="space-y-4">
  <div>
    <h3 className="font-semibold mb-1">Tool Photos</h3>
    <p className="text-sm text-gray-500 mb-4">
      Upload high-quality photos of your tool. Good photos will increase booking rates.
      <span className="text-red-500 ml-1">Main photo is required.</span>
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Main Photo */}
      <div className={`border-2 ${form.main_photo ? 'border-green-500' : 'border-dashed border-gray-300'} rounded-lg p-4 text-center`}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
          className="hidden"
          id="main_photo"
        />
        <label 
          htmlFor="main_photo" 
          className="cursor-pointer flex flex-col items-center justify-center h-40"
        >
          {form.main_photo ? (
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(form.main_photo)}
                alt="Main preview"
                className="h-full w-full object-cover rounded"
              />
              <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1 m-1">
                <Check size={12} />
              </div>
            </div>
          ) : (
            <div className="text-gray-400">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Main Photo (Required)</span>
            </div>
          )}
        </label>
      </div>

              {/* Additional Photos */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="hidden"
                    id={`photo_${index}`}
                  />
                  <label 
                    htmlFor={`photo_${index}`}
                    className="cursor-pointer flex flex-col items-center justify-center h-40"
                  >
                    {form.additional_photos[index] ? (
                      <img
                        src={URL.createObjectURL(form.additional_photos[index])}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">Additional Photo {index + 1}</span>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        {/* Back button and title header */}
        <div className="mb-8">
          <Link
            to="/partner-dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#0ac5b2' }}>Create New Listing</h1>
          
          {/* Steps Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeStep === index
                      ? 'border-[#0ac5b2] text-[#0ac5b2]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
              {fetchingData && (
        <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
          <div className="flex items-center">
            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>Loading categories and cities...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {renderStepContent(activeStep)}

          {error && <div className="text-red-500 mt-4">{error}</div>}
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
              className={`tn-button tn-button-outline ${activeStep === 0 ? 'invisible' : ''}`}
            >
              Previous
            </button>
            
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="tn-button tn-button-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="tn-button tn-button-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;