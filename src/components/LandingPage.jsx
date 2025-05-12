const LandingPage = ({ signIn }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-20 py-4 shadow-md">
        <div className="flex items-center gap-2">
          <img
            src="https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-gray-900">Disk</span>
        </div>
        <button
          onClick={signIn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-base font-medium"
        >
          Log In
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 flex-grow">
        {/* Left Section */}
        <div className="text-center lg:text-left max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Easy and secure access to your content
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Store, share, and collaborate on files and folders from your mobile device, tablet, or computer.
          </p>
          <div className="lg:hidden">
            <button
              onClick={signIn}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-10 lg:mb-0">
          <img
            src="/landingImage.jpg"
            alt="Drive Preview"
            className="w-full max-w-[700px] h-auto object-contain"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
