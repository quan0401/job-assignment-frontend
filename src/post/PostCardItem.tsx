import { FC, ReactElement, useState } from 'react';
import { commentService } from '~/services/api/comment.service';
import { FaTimesCircle } from 'react-icons/fa';
import { IPhoto, photoService } from '~/services/api/photo.service';
import ModalBg from '~shared/modals/ModalBg';

interface IPostCardItem {
  imageUrl: string;
  photoId: number;
  comments: any[];
  description: string;
  showDelete?: boolean;
  onDelete?: (photoId: string) => void;
  userId: number;
  photo: any;
  setPhotos: React.Dispatch<React.SetStateAction<IPhoto[]>>;
}

export const PostCardItem: FC<IPostCardItem> = ({
  imageUrl,
  comments,
  photoId,
  description,
  showDelete,
  onDelete,
  userId,
  photo,
  setPhotos
}): ReactElement => {
  const [showComments, setShowComments] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [commentList, setCommentList] = useState(comments);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDescription, setEditedDescription] = useState<string>(description);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const userId = parseInt(`${localStorage.getItem('userId')}`);
      const username = `${localStorage.getItem('username')}`;

      await commentService.createComments(parseInt(`${photoId}`), newComment, userId);
      const updatedComments = [...commentList, { username, text: newComment }];
      setCommentList(updatedComments);
      setNewComment('');
    }
  };

  const handleDelete = async () => {
    try {
      await photoService.deletePhoto(photoId, userId);
      onDelete && onDelete(`${photoId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = () => {
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const proceedDelete = () => {
    setShowConfirm(false);
    handleDelete();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (description === editedDescription && !newImage) return;

    // Function to convert image file to base64
    const toBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    let base64Image: string | undefined = undefined;

    if (newImage) {
      try {
        base64Image = await toBase64(newImage); // Convert image to base64
      } catch (error) {
        console.error('Error encoding image to base64:', error);
        return;
      }
    }

    const data: IPhoto = {
      description: editedDescription,
      image: base64Image, // Send the base64-encoded image
      id: photoId
    } as IPhoto;

    try {
      const res = await photoService.updatePhoto(data, userId);
      setPhotos((prevPhotos) => {
        const updatedPhotos = prevPhotos.map((prevPhoto) => {
          if (prevPhoto.id === photoId) {
            return {
              ...prevPhoto,
              description: editedDescription,
              url: res.data.photo.url
            };
          }
          return prevPhoto;
        });
        return updatedPhotos;
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedDescription(description); // Revert changes
    setNewImage(null); // Clear uploaded image
    setImagePreviewUrl(null); // Clear image preview
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewImage(file);
      const previewUrl = URL.createObjectURL(file); // Create a temporary preview URL
      setImagePreviewUrl(previewUrl);
    }
  };

  return (
    <div className="rounded w-full sm:w-72 md:w-72 lg:w-80">
      <div className="relative mb-8 flex flex-col gap-2">
        {!isEditing ? (
          <img
            src={imagePreviewUrl || imageUrl} // Use the preview URL if available
            alt="cover image"
            className="w-full rounded-lg h-72 object-cover"
          />
        ) : (
          <>
            <p className=" font-bold text-lg">Editing Image</p>

            <input type="file" onChange={handleImageUpload} className="mt-2" />
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="preview" className="w-full rounded-lg h-72 object-cover mt-2" />}
          </>
        )}
        {showDelete && !isEditing && (
          <FaTimesCircle onClick={confirmDelete} className="mt-2 cursor-pointer absolute top-0 right-2 text-red-600" />
        )}
      </div>

      {!isEditing ? (
        <div>Description: {description}</div>
      ) : (
        <div className="">
          <p>Description: </p>
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Edit description"
          />
        </div>
      )}

      {!isEditing && (
        <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded px-2 py-1 flex-grow"
            placeholder="Add a comment"
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
            Add
          </button>
        </form>
      )}
      <div className="flex items-center gap-3">
        <button
          disabled={commentList.length === 0}
          onClick={toggleComments}
          className="text-blue-500 hover:underline border border-blue-500 rounded px-2 py-1 my-3"
        >
          {commentList.length > 0
            ? commentList.length === 1
              ? `${showComments ? 'Hide' : 'Show'} ${commentList.length} Comment`
              : `${showComments ? 'Hide' : 'Show'} ${commentList.length} Comments`
            : 'No Comments'}
        </button>
        {!isEditing ? (
          <button onClick={handleEdit} className="bg-green-500 text-white rounded px-4 py-2 my-2">
            Edit Post
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              disabled={description === editedDescription && !newImage}
              onClick={handleSave}
              className={`bg-blue-500 text-white rounded px-4 py-2 my-2 ${description === editedDescription && !newImage ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
            >
              Save
            </button>
            <button onClick={handleCancelEdit} className=" bg-green-500 text-white rounded px-4 py-2 my-2">
              Cancel
            </button>
          </div>
        )}
      </div>

      {showComments && commentList.length > 0 && (
        <div className="flex items-center gap-2 relative bg-slate-200 px-2 py-3 mb-3 rounded-md">
          <div className="flex w-full justify-between flex-col max-h-48 overflow-y-scroll">
            {commentList.map((comment: any, index: number) => (
              <span key={index} className="text-md hover:underline">
                <strong className="text-sm font-bold md:text-base">{comment.username}: </strong>
                <strong className="text-sm font-medium md:text-base">{comment.text}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {showConfirm && (
        <ModalBg
          children={
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <p>Are you sure you want to delete this photo?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={cancelDelete} className="bg-gray-500 text-white rounded px-4 py-2">
                    Cancel
                  </button>
                  <button onClick={proceedDelete} className="bg-red-500 text-white rounded px-4 py-2">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
