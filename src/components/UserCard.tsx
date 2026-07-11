interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  const handleClick = (): void => {
    alert("Clicked!");
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>

      <button onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
}

export default UserCard;