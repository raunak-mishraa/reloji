"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import CompleteProfileModal from './CompleteProfileModal';

const ProfileCompletionContext = createContext<{ needsProfileCompletion: boolean }>({ needsProfileCompletion: false });

export const useProfileCompletion = () => useContext(ProfileCompletionContext);

export default function ProfileCompletionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBeenChecked, setHasBeenChecked] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !hasBeenChecked) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          const profile = data.profile;
          const needsCompletion = !profile || !profile.bio || !profile.phone;
          if (needsCompletion) {
            // Check if we've shown the modal before in this session
            const hasSkipped = sessionStorage.getItem('skippedProfileCompletion');
            if (!hasSkipped) {
              setIsModalOpen(true);
            }
          }
          setHasBeenChecked(true);
        });
    }
  }, [status, hasBeenChecked]);

  const handleClose = () => {
    sessionStorage.setItem('skippedProfileCompletion', 'true');
    setIsModalOpen(false);
  };

  const handleProfileComplete = () => {
    setIsModalOpen(false);
  };

  return (
    <ProfileCompletionContext.Provider value={{ needsProfileCompletion: isModalOpen }}>
      {children}
      <CompleteProfileModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        onProfileComplete={handleProfileComplete} 
      />
    </ProfileCompletionContext.Provider>
  );
}
