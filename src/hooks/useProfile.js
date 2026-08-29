import { useAuth } from '../lib/authContext';

export function useProfile() {
  const { profile, saveProfile, loading } = useAuth();
  
  const isProfileComplete = () => {
    return profile && profile.name && profile.age && profile.gender && profile.languages?.length > 0;
  };

  return { profile, saveProfile, isProfileComplete, loading };
}
