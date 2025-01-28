const generateUniqueSuffix = (roomId: number, originalname: string): string => {
  return `${roomId}-${Date.now() + '-' + Math.round(Math.random() * 1e9)}-${originalname}`;
};

export default generateUniqueSuffix;
