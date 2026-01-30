
import { ImageItem } from '../types';

const DB_KEY = 'picvault_db';

export const getImages = (): ImageItem[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveImages = (images: ImageItem[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(images));
};

export const addImage = (image: Omit<ImageItem, 'id' | 'downloads' | 'createdAt'>) => {
  const images = getImages();
  const newImage: ImageItem = {
    ...image,
    id: crypto.randomUUID(),
    downloads: 0,
    createdAt: Date.now()
  };
  saveImages([newImage, ...images]);
  return newImage;
};

export const updateImage = (updated: ImageItem) => {
  const images = getImages();
  saveImages(images.map(img => img.id === updated.id ? updated : img));
};

export const deleteImage = (id: string) => {
  const images = getImages();
  saveImages(images.filter(img => img.id !== id));
};

export const incrementDownloads = (id: string) => {
  const images = getImages();
  saveImages(images.map(img => 
    img.id === id ? { ...img, downloads: img.downloads + 1 } : img
  ));
};
