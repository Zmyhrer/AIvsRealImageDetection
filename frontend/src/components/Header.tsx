import React from "react";

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => (
  <header className="max-w-7xl mx-auto text-center mb-8">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
      {title}
    </h1>
    <p className="text-gray-600 text-lg md:text-xl">{description}</p>
  </header>
);

export default Header;
