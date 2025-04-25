import React, { useState, useEffect } from 'react'
import ProductList from '../ProductList';
import axios from '../../api/axiosSetUp';
import { loadCart } from '../../api/cartActions';
import {useDispatch} from 'react-redux';

const ProductsDBData = ({searchQuery}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    dispatch(loadCart());

    useEffect(() => {
        setLoading(true);
        axios.get('/product/fetchAllProducts')
            .then((response) => {
                console.log("", response?.data);
                setData(response?.data.products);
            } )
            .catch((err)=>{
                console.log("error : ", err);
            })
            .finally(()=>{
                setLoading(false);
            });
    },[]);

    if(loading) return <p>Loading... </p>
    //// Filter products based on search query
    const filteredData = data.filter(product => 
        product.productName.toLowerCase().includes(searchQuery)
    );

    return (
        <ProductList products={filteredData} />
    )
}

export default ProductsDBData