import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center  text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FontAwesomeIcon icon={faChevronRight} className="mx-2" />
            )}

            <span className="text-gray-500" aria-current="page">
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
