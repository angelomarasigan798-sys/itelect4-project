type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  user: User;
  variant?: 'default' | 'compact';
};

export default function UserCard({
  user,
  variant = 'default',
}: Props) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow dark:bg-gray-800 ${
        variant === 'compact' ? 'p-2 text-sm' : 'p-4'
      }`}
    >
      <h2 className="text-lg font-bold">{user.name}</h2>
      <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
    </div>
  );
}