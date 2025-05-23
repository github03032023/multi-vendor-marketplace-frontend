// import React from 'react';
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../slices/cartSlice";

// // Product Card Component which provides the product details displayed in a card sructure
// const ProductCard = ({ productCode, productName,description, price, category, vendorId, images  }) => {
// // Redux Settings
// const dispatch = useDispatch();
// // const user = getUserFromToken();

// const handleAddToCart = () => {
//     const product = { productCode, productName,description, price, category, vendorId, images  };
//     dispatch(addToCart(product)); // Dispatch action to Redux store
//   };

//     // Place holder image provided in case the actual image is not available
//     const defaultImage = "https://members.naeyc.org/eweb/images/DEMO1/notavailable.jpg";
//     return (
//         <div className="card h-100 d-flex flex-column">

//             <img
//                 src={images || defaultImage}
//                 className="card-img-top" alt="Camera Image"
//                 style={{
//                     width: "100%",
//                     height: "300px",
//                     objectFit: "cover",
//                     borderRadius: "5px",
//                     borderBottom: "1px solid #808080"
//                 }}
//             />
//             <div className="card-body d-flex flex-column">
//                 <h5 className="card-title">{productName}</h5>
//                 <p className="card-text fw-bold">{category}</p>
//                 <p className="card-text flex-grow-1">{description}</p>
//                 <a href="#" className="btn fw-bold">$. {price}</a>
//                 {/* Button always at bottom */}
//                 <button className="btn btn-primary mt-auto" onClick={handleAddToCart}>Buy Now</button>
//             </div>
//         </div>
//     )
// }

// export default ProductCard


// Implemented Carousel for multiple Images

import React from 'react';
import MyCarousel from "./MyCarousel";
import { Link } from "react-router-dom";

const ProductCard = ({ productId, productName, productCode, description, price, category, images, vendorId }) => {

  const defaultImage = [{
    url: "https://members.naeyc.org/eweb/images/DEMO1/notavailable.jpg",
    altText: "Image not available"
  }];

  const imageList = Array.isArray(images) && images.length > 0 ? images : defaultImage;

  return (
    <div className="card h-100 d-flex flex-column shadow-sm">
      {/* Carousel here */}
      <MyCarousel images={imageList} />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <div key={productId}>
            <Link to={`/product/${productCode}`}>
              {productName}
            </Link>
          </div>
        </h5>
        <p className="card-text fw-bold">{category}</p>
        <p className="card-text flex-grow-1">{description}</p>
        <p className="btn fw-bold">Rs. {price}</p>
        {/* <button className="btn btn-primary mt-auto" onClick={handleAddToCart}>Buy Now</button> */}
      </div>
    </div>
  );
};

export default ProductCard;






