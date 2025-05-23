// import React from 'react';
// import ProductCard from "../ProductCard";
// import 'bootstrap/dist/css/bootstrap.min.css';


// const ProductList = ({ products }) => {

//     return (
//         <div className="container text-center mt-4">

//             {/* Product List */}

//             <div className="row">
//                 {products.map((product) => (
//                     <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={product.productCode}>
//                         <ProductCard
//                             productId={product._id}
//                             productCode={product.productCode}
//                             productName={product.productName}
//                             images={product.images}
//                             price={product.price}
//                             category={product.category}
//                             description={product.description}
//                             vendorId={product.vendorId}
//                         />
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// };

// export default ProductList;




import React from 'react';
import ProductCard from "../ProductCard";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = ({ products }) => {
    console.log("ProductList response: ", products);

    return (
        <div className="container-fluid text-center mt-4">
            <div className="row">
                {products.map((product) => (
                    <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                        key={product.productCode}
                    >
                        <ProductCard
                            productId={product._id}
                            productCode={product.productCode}
                            productName={product.productName}
                            images={product.images}
                            price={product.price}
                            category={product.category}
                            description={product.description}
                            vendorId={product.vendorId}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
