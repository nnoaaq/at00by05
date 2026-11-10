const NotFound = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-dvh ">
      <h2 className="text-rose-900 text-8xl">404</h2>
      <p>Pyytämäsi data on eksynyt matkalla sinulle.</p>
      <p className="text-xs text-zinc-700">(Et voi tehdä asialle mitään.)</p>
    </div>
  );
};
export default NotFound;
