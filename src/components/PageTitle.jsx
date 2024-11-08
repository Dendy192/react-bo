import React from "react";

const PageTitle = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      {subtitle && <h2 className="text-lg text-gray-600">{subtitle}</h2>}
    </div>
  );
};

export default PageTitle;
