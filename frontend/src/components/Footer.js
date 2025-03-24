import '../styles/Footer.css';
const Footer = () => {
    return (
      <footer className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Connect</h2>
              <p className="text-sm mt-1"></p>
            </div>
            <div className="text-sm">Connecting Centennial College. &copy; {new Date().getFullYear()} Connect. All rights reserved.</div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  