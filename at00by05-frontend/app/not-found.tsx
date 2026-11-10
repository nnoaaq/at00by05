const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Data on eksynyt matkalla sivulle
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Mittausdataa ei löytynyt. Ota yhteyttä ylläpitäjään mikäli ongelma
          jatkuu.
        </p>
      </div>
    </main>
  );
};
export default NotFound;
