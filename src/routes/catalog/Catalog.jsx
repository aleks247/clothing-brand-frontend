import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Catalog.module.css";
// #TODO Make the pagination to fit full set of items based on the device screen size
export default function Catalog({ products, gender }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortType, setSortType] = useState("newest");

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const priceGap = 10; 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; 

    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(prev => prev.filter(c => c !== category));
        } else {
            setSelectedCategories(prev => [...prev, category]);
        }
    };

    const handleMinSlide = (e) => {
        const val = parseInt(e.target.value);
        if (maxPrice - val >= priceGap) setMinPrice(val);
    };

    const handleMaxSlide = (e) => {
        const val = parseInt(e.target.value);
        if (val - minPrice >= priceGap) setMaxPrice(val);
    };

    const handleMinInput = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        if (val >= 0 && val <= maxPrice - priceGap) {
            setMinPrice(val);
        }
    };

    const handleMaxInput = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 500;
        if (val <= 500 && val >= minPrice + priceGap) {
            setMaxPrice(val);
        }
    };

    useEffect(() => {
        let result = [...products];

        if (gender === "male") {
            result = result.filter(p => p.gender === "male" || p.gender === "unisex");
        } else if (gender === "female") {
            result = result.filter(p => p.gender === "female" || p.gender === "unisex");
        }

        if (searchTerm) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        result = result.filter(p => {
            const price = Number(p.price);
            return price >= minPrice && price <= maxPrice;
        });

        if (sortType === "priceAsc") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortType === "priceDesc") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortType === "newest") {
            result.sort((a, b) => b.id - a.id); 
        }

        setFilteredProducts(result);
        setCurrentPage(1); 
    }, [products, gender, searchTerm, selectedCategories, minPrice, maxPrice, sortType]);

    // PAGINATION LOGIC
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const rangePercentLeft = (minPrice / 500) * 100;
    const rangePercentWidth = ((maxPrice - minPrice) / 500) * 100;

    return (
        <div className={styles["container"]}>
            <div
                className={`overlay ${isSidebarOpen ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className={styles["header"]}>
                <div className={styles["searchGroup"]}>
                    <button className={styles["mobileFilterBtn"]} onClick={() => setSidebarOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        Filters
                    </button>
                    
                    <div className={styles["searchBox"]}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles["searchInput"]}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className={styles["searchIcon"]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <div className={styles["sortOptions"]}>
                    <span style={{ fontSize: "13px", color: "#888" }}>Sort by:</span>
                    <button className={sortType === "newest" ? styles["sortBtnActive"] : styles["sortBtn"]} onClick={() => setSortType("newest")}>Newest</button>
                    <button className={sortType === "priceAsc" ? styles["sortBtnActive"] : styles["sortBtn"]} onClick={() => setSortType("priceAsc")}>Price Low-High</button>
                    <button className={sortType === "priceDesc" ? styles["sortBtnActive"] : styles["sortBtn"]} onClick={() => setSortType("priceDesc")}>Price High-Low</button>
                </div>
            </div>

            <div className={styles["contentWrapper"]}>
                <aside className={`${styles["sidebar"]} ${isSidebarOpen ? styles["active"] : ""}`}>
                    <div className="mobile-only" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <strong>Filters</strong>
                        <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", fontSize: "24px" }}>&times;</button>
                    </div>

                    <div className={styles["section"]}>
                        <div className={styles["sectionTitle"]}>Category</div>
                        {categories.map((cat) => (
                            <label key={cat} className={styles["filterRow"]}>
                                <span className={styles["checkboxWrapper"]}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                    />
                                    <span className={styles["checkboxCustom"]}></span>
                                </span>
                                <span className={styles["filterLabel"]}>{cat}</span>
                            </label>
                        ))}
                        {categories.length === 0 && <div style={{color:'#999', fontSize:'13px'}}>No categories found</div>}
                    </div>

                    <div className={styles["section"]}>
                        <div className={styles["priceHeader"]}>
                            <span className={styles["sectionTitle"]} style={{ marginBottom: 0 }}>Price Range</span>
                        </div>
                        
                        <div className={styles["priceInputs"]}>
                            <input 
                                type="number" 
                                value={minPrice} 
                                onChange={handleMinInput} 
                                className={styles["priceInput"]}
                                placeholder="Min"
                            />
                            <span className={styles["priceSeparator"]}>-</span>
                            <input 
                                type="number" 
                                value={maxPrice} 
                                onChange={handleMaxInput} 
                                className={styles["priceInput"]}
                                placeholder="Max"
                            />
                        </div>

                        <div className={styles["sliderContainer"]}>
                            <div className={styles["sliderTrack"]}></div>
                            <div 
                                className={styles["sliderRange"]} 
                                style={{ left: `${rangePercentLeft}%`, width: `${rangePercentWidth}%` }}
                            ></div>
                            
                            <input 
                                type="range" 
                                min="0" max="500" 
                                value={minPrice} 
                                onChange={handleMinSlide}
                                className={styles["thumbInput"]}
                            />
                            <input 
                                type="range" 
                                min="0" max="500" 
                                value={maxPrice} 
                                onChange={handleMaxSlide}
                                className={styles["thumbInput"]}
                            />
                        </div>
                    </div>
                </aside>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ width: '100%', textAlign: 'center', padding: '60px' }}>
                            <h2 className={styles['no-products']}>No products found</h2>
                            <p style={{color:'#888'}}>Try adjusting your search or filters.</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm(""); 
                                    setSelectedCategories([]); 
                                    setMinPrice(0); 
                                    setMaxPrice(500);
                                }}
                                style={{marginTop:'20px', padding:'10px 20px', background:'black', color:'white', border:'none', borderRadius:'20px', cursor:'pointer'}}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles["grid"]}>
                                {currentItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div className={styles["pagination"]}>
                                    <button 
                                        className={styles["pageBtn"]} 
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button 
                                            key={i + 1}
                                            className={`${styles["pageBtn"]} ${currentPage === i + 1 ? styles["pageBtnActive"] : ""}`}
                                            onClick={() => paginate(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button 
                                        className={styles["pageBtn"]} 
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}