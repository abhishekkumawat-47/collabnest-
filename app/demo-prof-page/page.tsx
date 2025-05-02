// Frontend component
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplicationAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/applications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action, 
          projectId : "1a2189ef-d6c9-4902-a09b-d6541b61b7a4", 
          applicationId : "13d1aea7-1de0-4713-bd07-50ab8a84fc18"
        }),
      });

      // Handle redirect responses
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          router.push(location);
          return;
        }
      }

      // Check if response is HTML (error case)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/html')) {
        throw new Error('Server returned HTML response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to process application');
      }

     
    console.log('Response headers:', Object.fromEntries(response.headers));
    const data = await response.json();
    console.log('Response data:', data);
      setLoading(false);
      alert('Application processed successfully!');
      // Return updated data if successful
      
    return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Application Action</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleAction('accept')}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          {loading ? 'Processing...' : 'Accept Application'}
        </button>

        <button
          onClick={() => handleAction('reject')}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'
          } text-white transition-colors`}
        >
          {loading ? 'Processing...' : 'Reject Application'}
        </button>
      </div>
    </div>
  );
}
