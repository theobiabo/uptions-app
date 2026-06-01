
import Logo from './logo';

export function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-accent fixed top-0 left-0 z-50">
      <div className="animate-pulse">
        <Logo />
      </div>
    </div>
  );
}
