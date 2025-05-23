
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-dark text-white pt-5 pb-4">
//       <div className="container text-md-left">
//         <div className="row text-md-left">

//           {/* About Section */}
//           <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
//             <h5 className="text-uppercase mb-4 font-weight-bold text-warning">About</h5>
//             <p><Link to="/footer-info#about" className="text-white text-decoration-none">About Us</Link></p>
//             <p><Link to="/footer-info#contact" className="text-white text-decoration-none">Contact Us</Link></p>
//           </div>

//           {/* Consumer Policy */}
//           <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
//             <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Consumer Policy</h5>
//             <p><Link to="/footer-info#cancellation" className="text-white text-decoration-none">Cancellation & Returns</Link></p>
//             <p><Link to="/footer-info#terms" className="text-white text-decoration-none">Terms of Use</Link></p>
//           </div>

//           {/* Mail Us */}
//           <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
//             <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Mail Us:</h5>
//             <p>SmartBuy Marketplace Pvt Ltd,<br />
//               123, Digital Hub Lane,<br />
//               Bengaluru, Karnataka 560001,<br />
//               India</p>
//           </div>

//           {/* Register/Social */}
//           <div className="col-md-2 col-lg-3 col-xl-3 mx-auto mt-3">
//             <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Join SmartBuy</h5>
//             <Link to="/register/seller" className="btn btn-outline-warning btn-sm mb-2 w-100">Become a Seller</Link>
//             <Link to="/register/customer" className="btn btn-outline-light btn-sm w-100">Register as Customer</Link>

//             <div className="mt-4">
//               <h6 className="text-uppercase text-warning mb-2">Follow Us</h6>
//               <a href="#" className="text-white me-3 fs-5"><i className="fab fa-facebook"></i></a>
//               <a href="#" className="text-white me-3 fs-5"><i className="fab fa-twitter"></i></a>
//               <a href="#" className="text-white me-3 fs-5"><i className="fab fa-instagram"></i></a>
//               <a href="#" className="text-white fs-5"><i className="fab fa-linkedin"></i></a>
//             </div>
//           </div>

//         </div>

//         <hr className="my-4" style={{ backgroundColor: '#bbb' }} />

//         <div className="row align-items-center">
//           <div className="col-md-7 col-lg-8">
//             <p className="text-white">© 2025 SmartBuy Marketplace. All rights reserved.</p>
//           </div>
//           <div className="col-md-5 col-lg-4 text-md-end">
//             <Link to="/footer-info#privacy" className="text-white text-decoration-none">Privacy Policy</Link>
//             <span className="text-white mx-2">|</span>
//             <Link to="/footer-info#help" className="text-white text-decoration-none">Help</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(to right, #001f3f, #003366)',
      }}
      className="text-white pt-5 pb-4"
    >
      <div className="container text-md-left">
        <div className="row text-md-left">

          {/* About Section */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">About</h5>
            <p><Link to="/footer-info#about" className="text-white text-decoration-none">About Us</Link></p>
            <p><Link to="/footer-info#contact" className="text-white text-decoration-none">Contact Us</Link></p>
          </div>

          {/* Consumer Policy */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Consumer Policy</h5>
            <p><Link to="/footer-info#cancellation" className="text-white text-decoration-none">Cancellation & Returns</Link></p>
            <p><Link to="/footer-info#terms" className="text-white text-decoration-none">Terms of Use</Link></p>
          </div>

          {/* Mail Us */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Mail Us:</h5>
            <p>SmartBuy Marketplace Pvt Ltd,<br />
              123, Digital Hub Lane,<br />
              Bengaluru, Karnataka 560001,<br />
              India</p>
          </div>

          {/* Register/Social */}
          <div className="col-md-2 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Join SmartBuy</h5>
            <Link to="/vendorRegister" className="btn btn-outline-warning btn-sm mb-2 w-100">Become a Seller</Link>
            <Link to="/userRegister" className="btn btn-outline-light btn-sm w-100">Register as Customer</Link>

            <div className="mt-4">
              <h6 className="text-uppercase text-warning mb-2">Follow Us</h6>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white fs-5"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

        </div>

        <hr className="my-4" style={{ backgroundColor: '#bbb' }} />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-white">© 2025 SmartBuy Marketplace. All rights reserved.</p>
          </div>
          <div className="col-md-5 col-lg-4 text-md-end">
            <Link to="/footer-info#privacy" className="text-white text-decoration-none">Privacy Policy</Link>
            <span className="text-white mx-2">|</span>
            <Link to="/footer-info#help" className="text-white text-decoration-none">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
