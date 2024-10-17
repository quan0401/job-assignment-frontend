import { userService } from '~/services/api/user.service';

interface UsernameFormProps {
  username: string;
  setUsername: (username: string) => void;
  setShowForm: (showForm: boolean) => void;
}

export const UsernameForm: React.FC<UsernameFormProps> = ({ username, setUsername, setShowForm }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await userService.createUser(username);
    localStorage.setItem('username', res.data.user.username);
    localStorage.setItem('userId', res.data.user.id);
    setShowForm(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-6 rounded shadow-md w-80 ">
        <label htmlFor="username" className="text-lg font-medium">
          Username to continue:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
          Submit
        </button>
      </form>
    </div>
  );
};
