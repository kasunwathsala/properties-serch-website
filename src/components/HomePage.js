import React, { useState, useEffect } from "react";
import properties from "../data/properties.json";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredByType, setFilteredByType] = useState(properties);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Advanced search state
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    dateAdded: "",
    postcode: "",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filtered = properties.filter(
        (item) =>
          (item.postcode.toLowerCase().includes(value.toLowerCase()) || item.location.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase())) &&
          filteredByType.includes(item)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleItemClick = (item) => {
    setQuery(item.name); // Set the input value to the clicked item's name
    setFilteredData([]); // Close the dropdown
  };

  const filterByType = (type) => {
    setAdvancedSearch({
      type: "",
      minPrice: "",
      maxPrice: "",
      minBedrooms: "",
      maxBedrooms: "",
      dateAdded: "",
      postcode: "",
      location: "",
    })
    const filtered = properties.filter((item) => item.type === type);
    setFilteredByType(filtered);
    setFilteredData([]);
    setQuery("");
  };

  const handleAdvancedSearchChange = (event) => {
    const { name, value } = event.target;
    setAdvancedSearch((prev) => ({ ...prev, [name]: value }));
  };

  const performAdvancedSearch = () => {
    const filtered = properties.filter((item) => {
      const {
        type,
        minPrice,
        maxPrice,
        minBedrooms,
        maxBedrooms,
        dateAdded,
        postcode,
        location,
      } = advancedSearch;

      const matchesType = type ? item.type === Number(type) : true;
      const matchesMinPrice = minPrice ? item.price >= Number(minPrice) : true;
      const matchesMaxPrice = maxPrice ? item.price <= Number(maxPrice) : true;
      const matchesMinBedrooms = minBedrooms
        ? item.bedrooms >= Number(minBedrooms)
        : true;
      const matchesMaxBedrooms = maxBedrooms
        ? item.bedrooms <= Number(maxBedrooms)
        : true;
      const matchesDateAdded = dateAdded
        ? new Date(item.dateAdded) >= new Date(dateAdded)
        : true;
      const matchesPostcode = postcode
        ? item.postcode.toLowerCase().includes(postcode.toLowerCase())
        : true;
      const matchesLocation = location
        ? item.location.toLowerCase().includes(location.toLowerCase())
        : true;

      return (
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinBedrooms &&
        matchesMaxBedrooms &&
        matchesDateAdded &&
        matchesPostcode &&
        matchesLocation
      );
    });

    setFilteredByType(filtered);
  };

  const toggleFavorite = (property) => {
    if (favorites.some((fav) => fav.id === property.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== property.id));
    } else {
      setFavorites([...favorites, property]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const handleDragStart = (event, property) => {
    event.dataTransfer.setData("property", JSON.stringify(property));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const property = JSON.parse(event.dataTransfer.getData("property"));
    if (!favorites.some((fav) => fav.id === property.id)) {
      setFavorites((prev) => [...prev, property]);
    }
  };

  const handleRemoveDrop = (event) => {
    event.preventDefault();
    const property = JSON.parse(event.dataTransfer.getData("property"));
    setFavorites((prev) => prev.filter((fav) => fav.id !== property.id));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">Property Finder</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <form className="d-flex ms-lg-auto mt-3 mt-lg-0">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search by postcode,location..."
                value={query}
                onChange={handleInputChange}
              />
            </form>
            <div className="d-flex justify-content-center flex-wrap mt-3 mt-lg-0 ms-lg-3">
              <button
                className="btn btn-primary me-2 mb-2 mb-lg-0"
                onClick={() => filterByType(1)} // 1 = For Sale
              >
                For Sale
              </button>
              <button
                className="btn btn-secondary mb-2 mb-lg-0"
                onClick={() => filterByType(2)} // 2 = For Rent
              >
                For Rent
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {/* Toggle Advanced Search */}
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}
          >
            {advancedSearchVisible ? "Hide Advanced Search" : "Show Advanced Search"}
          </button>
        </div>

        {/* Advanced Search Form */}
        {advancedSearchVisible && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Advanced Search</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Type</label>
                  <select
                    className="form-control"
                    name="type"
                    value={advancedSearch.type}
                    onChange={handleAdvancedSearchChange}
                  >
                    <option value="">All</option>
                    <option value="1">For Sale</option>
                    <option value="2">For Rent</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Min Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="minPrice"
                    value={advancedSearch.minPrice}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Max Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxPrice"
                    value={advancedSearch.maxPrice}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Min Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="minBedrooms"
                    value={advancedSearch.minBedrooms}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Max Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxBedrooms"
                    value={advancedSearch.maxBedrooms}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Date Added</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateAdded"
                    value={advancedSearch.dateAdded}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Postcode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postcode"
                    value={advancedSearch.postcode}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={advancedSearch.location}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={performAdvancedSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Property Cards */}
        <div className="container-fluid">
          <div className="row">
            {/* Main Content Section */}
            <div className="col-lg-9 col-md-8 col-12 mt-4" onDrop={handleRemoveDrop} onDragOver={handleDragOver}>
              <div className="row">
                {filteredByType.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex"
                    onDragStart={(event) => handleDragStart(event, item)}
                  >
                    <div className="card h-100 w-100">
                      <img
                        src={require(`../Assets/${item.images[0]}`)}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "250px" }}
                        alt={item.name}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">
                          {item.description && item.description.length > 100
                            ? `${item.description.substring(0, 100)}...`
                            : item.description || "A beautiful property located in an excellent area."}
                        </p>
                        <p className="card-text">
                          <strong>Location:</strong> {item.location}
                        </p>
                        <div className="mt-auto d-flex flex-column flex-sm-row justify-content-between">
                          <button
                            className={`btn ${favorites.some((fav) => fav.id === item.id)
                              ? "btn-danger"
                              : "btn-outline-danger"
                              }`}
                            onClick={() => toggleFavorite(item)}
                          >
                            {favorites.some((fav) => fav.id === item.id)
                              ? "Remove Favorite"
                              : "Add to Favorite"}
                          </button>
                          <a
                            href={`/property/${item.id}`}
                            className="btn btn-primary mt-2 mt-sm-0 ms-sm-2"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>

            {/* Favorites Section */}
            <div
              className="col-lg-3 col-md-4 col-12"
              style={{
                padding: "1rem",
                background: "#f8f9fa",
                borderLeft: "1px solid #ddd",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h4>Favorites</h4>
              <button className="btn btn-danger mb-3" onClick={clearFavorites}>
                Clear All
              </button>
              <div style={{ minHeight: "300px" }}>
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="card mb-2"
                    draggable
                    onDragStart={(event) => handleDragStart(event, fav)}
                    onDragOver={handleDragOver}
                  >
                    <img
                      src={require(`../Assets/${fav.images[0]}`)}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "150px" }}
                      alt={fav.name}
                    />
                    <div className="card-body">
                      <h5>{fav.name}</h5>
                      <p>{fav.location}</p>
                      <div className="mt-auto d-flex flex-column">
                        <button
                          className="btn btn-danger mb-2"
                          onClick={() => removeFavorite(fav.id)}
                        >
                          Remove Favorite
                        </button>
                        <a
                          href={`/property/${fav.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center text-lg-start mt-5">
        <div className="text-center p-3" style={{ backgroundColor: "#f8f9fa" }}>
          &copy; {new Date().getFullYear()} Property Finder. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
