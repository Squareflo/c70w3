// In src/contexts/AuthContext.tsx

// Replace the existing generateAvatar function with this simpler version:
const generateAvatar = async (): Promise<string> => {
  // Simply return the static avatar URL
  return 'https://avatar.iran.liara.run/public';
};
