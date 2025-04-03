'use client';

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white text-sm">
      <div className="text-center py-4 bg-gray-700">
        <a
          onClick={() => {
            handleBackToTop();
          }}
          className="text-white hover:underline hover:cursor-pointer"
        >
          Back to Top
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 content-center gap-6 p-10 text-center sm:text-left">
        <div>
          <h3 className="font-bold text-lg mb-2">Get to Know Us</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About Amazon
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Investor Relations
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Amazon Devices
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Amazon Science
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Make Money with Us</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Sell on Amazon
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Become an Affiliate
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Advertise Your Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Self-Publish with Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Amazon Payment Products</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Amazon Business Card
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop with Points
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Reload Your Balance
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Let Us Help You</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Your Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Your Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Returns & Replacements
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 bg-gray-800">
        <p className="text-xs">
          © 1996-2023, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
};

export default Footer;
