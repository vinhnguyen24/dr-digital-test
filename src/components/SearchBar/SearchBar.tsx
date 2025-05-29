// components/SearchBar.tsx
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <input
      type="text"
      placeholder="Tìm theo tên hoặc mã nhân viên..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{ padding: "8px", width: "100%", maxWidth: 400 }}
    />
  );
};

export default SearchBar;
