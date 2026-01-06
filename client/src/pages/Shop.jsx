import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import { productsAPI } from '../services/api';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const filters = {
        gender: searchParams.get('gender') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'newest',
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                gender: filters.gender || undefined,
                category: filters.category || undefined,
                sort: filters.sort,
            };
            const { data } = await productsAPI.getAll(params);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const categories = ['hoodies', 't-shirts', 'shorts', 'jackets', 'pants'];
    const genders = ['men', 'women', 'unisex'];
    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    const hasActiveFilters = filters.gender || filters.category;

    const getPageTitle = () => {
        if (filters.gender) {
            return `${filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)}'s Collection`;
        }
        if (filters.category) {
            return filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
        }
        return 'Shop All Products';
    };

    const getBreadcrumbs = () => {
        const crumbs = [{ label: 'Shop', link: '/shop' }];
        if (filters.gender) {
            crumbs.push({ label: filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1) });
        }
        if (filters.category) {
            crumbs.push({ label: filters.category.charAt(0).toUpperCase() + filters.category.slice(1) });
        }
        return crumbs;
    };

    return (
        <>
            <PageHeader
                title={getPageTitle()}
                subtitle={`${products.length} products found`}
                breadcrumbs={getBreadcrumbs()}
            />
            <div className="page" style={{ paddingTop: 0 }}>
                <div className="container">
                    {/* Sort Controls */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
                        <select
                            className="form-input"
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            style={{ width: 'auto', minWidth: 180 }}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="shop-layout">
                        {/* Filters Sidebar */}
                        <aside className="filters-sidebar">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                <h3>Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={clearFilters}
                                        style={{ color: 'var(--color-accent)' }}
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Gender Filter */}
                            <div className="filter-section">
                                <h4 className="filter-title">Gender</h4>
                                <div className="filter-options">
                                    <div
                                        className={`filter-option ${!filters.gender ? 'active' : ''}`}
                                        onClick={() => updateFilter('gender', '')}
                                    >
                                        All
                                    </div>
                                    {genders.map((gender) => (
                                        <div
                                            key={gender}
                                            className={`filter-option ${filters.gender === gender ? 'active' : ''}`}
                                            onClick={() => updateFilter('gender', gender)}
                                        >
                                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="filter-section">
                                <h4 className="filter-title">Category</h4>
                                <div className="filter-options">
                                    <div
                                        className={`filter-option ${!filters.category ? 'active' : ''}`}
                                        onClick={() => updateFilter('category', '')}
                                    >
                                        All Categories
                                    </div>
                                    {categories.map((category) => (
                                        <div
                                            key={category}
                                            className={`filter-option ${filters.category === category ? 'active' : ''}`}
                                            onClick={() => updateFilter('category', category)}
                                        >
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div>
                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--spacing-sm)',
                                    marginBottom: 'var(--spacing-xl)',
                                    flexWrap: 'wrap'
                                }}>
                                    {filters.gender && (
                                        <span
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => updateFilter('gender', '')}
                                        >
                                            {filters.gender} <FiX />
                                        </span>
                                    )}
                                    {filters.category && (
                                        <span
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => updateFilter('category', '')}
                                        >
                                            {filters.category} <FiX />
                                        </span>
                                    )}
                                </div>
                            )}

                            {loading ? (
                                <div className="loading">
                                    <div className="spinner"></div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🔍</div>
                                    <h3 className="empty-title">No products found</h3>
                                    <p className="empty-description">
                                        Try adjusting your filters to find what you're looking for.
                                    </p>
                                    <button className="btn btn-primary" onClick={clearFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="products-grid">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
