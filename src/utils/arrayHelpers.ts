export const generateRandomArray = (size: number, min: number = 10, max: number = 500): number[] => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getSpeedDelay = (speed: number): number => {
  // Convert speed (1-10) to delay (500-10ms)
  return Math.max(10, 510 - speed * 50);
};

export const isSorted = (arr: number[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
};