import React from 'react';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: 'small' | 'medium' | 'large' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 'medium' }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-20 h-20 text-2xl',
    xl: 'w-40 h-40 text-4xl', // New extra large size
  };

  const currentSizeClass = sizeClasses[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold ${currentSizeClass}`}
    >
      {imageUrl ? (
        <img
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          src={imageUrl}
          alt={name}
        />
      ) : (
        <span className="z-10">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
