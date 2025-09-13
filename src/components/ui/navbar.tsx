import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="bg-white pt-4 pr-8 pb-4 pl-8">
      <nav className="w-full">
        <div className="w-full justify-between mt-auto mr-auto mb-auto ml-auto md:flex-row flex max-w-screen-2xl">
          <div className="justify-center items-center mb-2 md:m-0 flex flex-row">
            <img alt="ChowLocal" src="https://chowlocal.com/x/assets/images/chowlocallogo.png" className="w-12 md:w-16" />
          </div>
          <div className="bg-white justify-end items-center md:flex flex flex-row flex-wrap hidden">
            <Link to="/" className="text-gray-600 text-center mr-6 font-medium text-base font-raleway">
              Home
            </Link>
            <Link to="/" className="text-gray-600 text-center mr-6 font-medium text-base font-raleway">
              Add A Restaurant
            </Link>
            <Link to="/" className="text-gray-600 text-center mr-6 font-medium text-base font-raleway">
              Contact Us
            </Link>
            <Link 
              to="/sign-in" 
              className="h-9 w-24 text-white bg-blue-700 hover:bg-blue-900 hover:border-blue-900 border-2 flex items-center justify-center text-center border-blue-700 rounded-lg text-lg font-normal"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};