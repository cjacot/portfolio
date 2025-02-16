export const getEnvVar = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const ENV = {
  ADMIN_PASSWORD: getEnvVar('VITE_ADMIN_PASSWORD'),
  ENCRYPTION_KEY: getEnvVar('VITE_ENCRYPTION_KEY'),
  IS_DEV: import.meta.env.DEV,
}; 