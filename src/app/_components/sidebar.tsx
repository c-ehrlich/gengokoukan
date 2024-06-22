export function Sidebar() {
  return (
    <div className="flex h-full w-1/6 flex-col bg-gray-800">
      <div className="flex flex-col items-center justify-center">
        <span>t3</span>
        <h1 className="text-2xl text-white">T3</h1>
      </div>
      <div className="flex flex-col items-center justify-center">
        <a
          href="/"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-700"
        >
          <span>H</span> <span>Home</span>
        </a>
        <a
          href="/profile"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-700"
        >
          <span>P</span> <span>Profile</span>
        </a>
        <a
          href="/settings"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-700"
        >
          <span>S</span> <span>Settings</span>
        </a>
      </div>
    </div>
  );
}
