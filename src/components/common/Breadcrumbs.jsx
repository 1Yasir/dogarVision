import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

export default function Breadcrumbs({ items }) {
  return (
    <Breadcrumb className="mb-3">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Breadcrumb.Item
            key={item.label}
            active={isLast}
            linkAs={isLast ? undefined : Link}
            linkProps={isLast ? undefined : { to: item.to }}
          >
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}