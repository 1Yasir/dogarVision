import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="breadcrumbs__item">
              {!isLast && (
                <>
                  <Link to={item.to} className="breadcrumbs__link">
                    {item.label}
                  </Link>
                  <span className="breadcrumbs__sep" aria-hidden="true">›</span>
                </>
              )}
              {isLast && (
                <span className="breadcrumbs__current">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}