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






// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ProductCard = ({ productId, productName, images, price, category, description }) => {
//     return (
//         <div className="card h-100 shadow-sm">
//             <div className="carousel slide" id={`carousel-${productId}`} data-bs-ride="carousel">
//                 <div className="carousel-inner">
//                     {images.map((img, index) => (
//                         <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={img._id}>
//                             <img
//                                 src={img.url}
//                                 alt={img.altText}
//                                 className="d-block w-100"
//                                 style={{ height: '200px', objectFit: 'cover' }}
//                             />
//                         </div>
//                     ))}
//                 </div>
//                 {images.length > 1 && (
//                     <>
//                         <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${productId}`} data-bs-slide="prev">
//                             <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                         </button>
//                         <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${productId}`} data-bs-slide="next">
//                             <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                         </button>
//                     </>
//                 )}
//             </div>

//             <div className="card-body">
//                 <h5 className="card-title">{productName}</h5>
//                 <p className="card-text">{description}</p>
//                 <p className="text-muted">{category}</p>
//                 <h6>${price}</h6>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;





import React from 'react';
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import MyCarousel from "./MyCarousel"; 

const ProductCard = ({ productId, productName, description, price, category, images }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const product = { productId, productName, description, price, category, images };
    dispatch(addToCart(product));
  };

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
        <h5 className="card-title">{productName}</h5>
        <p className="card-text fw-bold">{category}</p>
        <p className="card-text flex-grow-1">{description}</p>
        <p className="btn fw-bold">$. {price}</p>
        <button className="btn btn-primary mt-auto" onClick={handleAddToCart}>Buy Now</button>
      </div>
    </div>
  );
};

export default ProductCard;






