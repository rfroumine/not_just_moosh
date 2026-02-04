import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSeedDefaultFoods } from '../../queries/useFoods';

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [babyName, setBabyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateProfile, user } = useAuth();
  const seedFoods = useSeedDefaultFoods();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim()) {
      setError('Please enter your baby\'s name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: profileError } = await updateProfile(babyName.trim());
      if (profileError) {
        setError('Failed to save profile. Please try again.');
        return;
      }

      // Seed default foods for new user
      if (user?.id) {
        await seedFoods.mutateAsync(user.id);
      }

      onComplete();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👶</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Not Just Moosh!
          </h1>
          <p className="text-gray-600">
            Let's get started by setting up your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <label
              htmlFor="babyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What's your baby's name?
            </label>
            <input
              type="text"
              id="babyName"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Enter baby's name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Setting up...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}
