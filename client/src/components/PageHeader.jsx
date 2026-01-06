import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
    return (
        <div className="page-header">
            <div className="container">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="breadcrumbs">
                        <Link to="/" className="breadcrumb-item">Home</Link>
                        {breadcrumbs.map((crumb, index) => (
                            <span key={index}>
                                <FiChevronRight className="breadcrumb-separator" />
                                {crumb.link ? (
                                    <Link to={crumb.link} className="breadcrumb-item">{crumb.label}</Link>
                                ) : (
                                    <span className="breadcrumb-item active">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
};

export default PageHeader;
