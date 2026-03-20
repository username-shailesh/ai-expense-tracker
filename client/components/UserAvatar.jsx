/**
 * User Avatar Component
 * Displays user profile image or first letter initial in a circle
 */

export function UserAvatar({ name = '', image = null, size = 'md' }) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  // Avatar gradient colors based on first letter
  const getAvatarColor = () => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600',
      'from-indigo-400 to-indigo-600',
    ];
    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (image) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md`}>
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-full 
      flex items-center justify-center 
      flex-shrink-0 
      font-bold 
      text-white 
      bg-gradient-to-br 
      ${getAvatarColor()}
      border-2 border-white
      shadow-md
    `}>
      {firstLetter}
    </div>
  );
}

export default UserAvatar;
