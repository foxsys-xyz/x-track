import logo from '../Assets/logo.png';

function Boot() {
  return (
    <div className="font-mono h-screen flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <img src={logo} className="h-28 flex mb-6 mx-auto" alt="logo" />
        <h3 className="text-3xl">
          x-track
        </h3>
        <span>flight tracker for foxsys-xyz</span>
        <div className="progress mt-6"></div>
      </div>
    </div>
  );
}

export default Boot;
