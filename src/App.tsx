import { FC, ReactElement, RefObject, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PostCardItem } from './post/PostCardItem';
import { IPhoto, photoService } from './services/api/photo.service';
import ModalBg from '~shared/modals/ModalBg';
import { UsernameForm } from './forms/UsernameForm';
import UploadImage from './forms/UploadImage';
import useScrollToBottom from '~shared/hooks/useScrollToBottom';

// import { AppRouter } from './AppRoutes';

const App: FC = (): ReactElement => {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [userId, _] = useState<number>(parseInt(`${localStorage.getItem('userId')}`));

  const scrollRef: RefObject<HTMLDivElement> = useScrollToBottom(photos);

  const onDeletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== parseInt(photoId));
    setPhotos(updatedPhotos);
  };

  useEffect(() => {
    photoService.getPhotos().then((res) => {
      const data = res.data;

      setPhotos(data.photos);
    });
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setShowForm(true);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <div className="w-screen min-h-screen flex flex-col relative" ref={scrollRef}>
          {showForm && <ModalBg children={<UsernameForm username={username} setUsername={setUsername} setShowForm={setShowForm} />} />}
          <div className="container mx-auto items-center p-5">
            <div className="flex items-center gap-3">
              <UploadImage setPhotos={setPhotos} />
              <ul className="list-disc pl-5">
                <li>Only able to delete your uploaded images</li>
              </ul>
            </div>
            {/* <div className="grid gap-x-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
            <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((photo: any, index: number) => {
                return (
                  <PostCardItem
                    key={index}
                    imageUrl={`${photo.url}`}
                    comments={photo.Comments}
                    photoId={photo.id}
                    description={photo.description}
                    showDelete={userId === photo.userId}
                    userId={userId}
                    onDelete={onDeletePhoto}
                    photo={photo}
                    setPhotos={setPhotos}
                  />
                );
              })}
            </div>
          </div>
          <ToastContainer className={' text-gray-500'} />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
