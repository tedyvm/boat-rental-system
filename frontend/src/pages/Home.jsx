import { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/Home.css";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const handleSearch = (filters) => {
    console.log("Filters:", filters);
    // čia galėsi daryti redirect į /boats su query parametrais
    // pvz.: navigate(`/boats?${new URLSearchParams(filters)}`);
  };

  return (
    <div>
      <div className="container-fluid hero-section">
        <div className="container hero-container pb-5">
          <div className="row">
            <div className="col-lg-6 col-12 text-white text-start text-md-center ">
              <h1 className="hero-title">Sailing adventure starts here...</h1>
              <p className="hero-subtitle mt-3">
                Find the best boats at the best prices – start your journey
                today!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container-fluid search-bar">
        <div className="container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}
