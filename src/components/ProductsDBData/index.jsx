import React, { useState, useEffect } from 'react'
import ProductList from '../ProductList';
import axiosInstance from '../../api/axiosSetUp';
import { loadCart } from '../../api/cartActions';
import { useDispatch } from 'react-redux';
import FilterComponent from '../FilterComponent/filter';
import HomepageSections from '../HomePageSections/homePageSections';
import BannerDisplay from '../Banner/bannerDisplay';
import { Container, Row, Col } from 'react-bootstrap';

const ProductsDBData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ sort: '', brand: '', category: '' });
    const dispatch = useDispatch();
    dispatch(loadCart());

    useEffect(() => {
        setLoading(true);
        axiosInstance.get('/product/fetchAllProducts')
            .then((response) => {
                console.log("", response?.data);
                setData(response?.data.products);
            })
            .catch((err) => {
                console.log("error : ", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading... </p>

    // Get unique brands and categories
    const brands = [...new Set(data.map(p => p.brand))];
    const categories = [...new Set(data.map(p => p.category))];

    // Filter products based on search query
    let filteredData = data.filter(product =>
        product.productName.toLowerCase().includes(searchQuery)
    );

    if (filters.brand) {
        filteredData = filteredData.filter(p => p.brand === filters.brand);
    }

    if (filters.category) {
        filteredData = filteredData.filter(p => p.category === filters.category);
    }

    if (filters.sort === 'lowToHigh') {
        filteredData.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'highToLow') {
        filteredData.sort((a, b) => b.price - a.price);
    }

    return (
        <div>

            {/* Sticky FilterComponent FIRST */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1020, backgroundColor: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>

                        <FilterComponent
                            filters={filters}
                            setFilters={setFilters}
                            brands={brands}
                            categories={categories}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
               </div>

                <Container fluid className="mt-4">
                    <Row>
                        <Col>
                            <BannerDisplay />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ProductList products={filteredData} />
                        </Col></Row>
                    <Row>
                        <Col>
                            <HomepageSections />
                        </Col></Row>
                </Container>
            </div>
            );
};

            export default ProductsDBData