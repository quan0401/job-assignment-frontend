import React, { useState, useCallback, useRef } from 'react';
import { IPhoto, photoService } from '~/services/api/photo.service';

interface IUploadImageProps {
  setPhotos: React.Dispatch<React.SetStateAction<IPhoto[]>>;
}

const UploadImage: React.FC<IUploadImageProps> = ({ setPhotos }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage && base64Image) {
      setLoading(true);
      setSuccess(false);
      const data = {
        image: base64Image,
        description: description,
        userId: parseInt(`${localStorage.getItem('userId')}`)
      } as IPhoto;

      try {
        const res = await photoService.uploadPhoto(data);
        const {
          data: { photo }
        } = res;
        setPhotos((prevPhotos: IPhoto[]) => [...prevPhotos, photo]);
        setSuccess(true);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNewUpload = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setDescription('');
    setBase64Image(null);
    setSuccess(false);
  };

  return (
    <div className="flex items-center">
      <div className="flex gap-4 bg-white p-4 mt-4 rounded shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-100">
          <label htmlFor="imageUpload" className="text-lg font-medium">
            Upload Image:
          </label>
          <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-dashed border-2 border-gray-400 p-4 rounded">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded px-2 py-1"
              required
              ref={fileInputRef}
            />
            <p className="text-gray-500">Drag and drop an image here, or click to select a file</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="description" className="">
              Description:
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className={`rounded px-4 py-2 mt-2 text-white ${loading ? 'bg-gray-500' : success ? 'bg-green-500' : 'bg-blue-500'}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : success ? 'Success!' : 'Submit'}
          </button>
          {success && (
            <button type="button" onClick={handleNewUpload} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
              Upload Another Photo
            </button>
          )}
          {success && <p className="text-green-500 mt-2">Upload successful!</p>}
        </form>
        {previewUrl && (
          <div className="flex-shrink-0">
            <img src={previewUrl} alt="Image Preview" className="w-48 h-48 object-cover rounded" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
