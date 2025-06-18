import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import properties from "../data/properties.json";

const PropertyDetails = () => {
  const { id } = useParams(); // Get property ID from URL
  const property = properties.find((item) => item.id === parseInt(id));
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });


  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  if (!property) {
    return <div className="container mt-5">Property not found!</div>;
  }

  const isForRent = property.type === 2;

  const handleAddToFavorites = () => {
    if (favorites.some((fav) => fav.id === property.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== property.id));
    } else {
      setFavorites([...favorites, property]);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">Property Finder</a>
        </div>
      </nav>
      <div className="container mt-4">
        <h1 className="mb-3">{property.name}</h1>
        <div className="row">
          {/* Images */}
          <div className="col-md-6">
            <div
              id="carouselExample"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner" style={{ maxHeight: "400px", overflow: "hidden" }}>
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={require(`../Assets/${image}`)}
                      className="d-block w-100"
                      style={{ objectFit: "cover", height: "400px" }}
                      alt={`Property Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="col-md-6">
            <h4 className="text-primary">{isForRent ? "For Rent" : "For Sale"}</h4>
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Address:</strong> {property.address}</p>
            <p><strong>Postcode:</strong> {property.postcode}</p>
            <p><strong>Price:</strong> LKR {property.price.toLocaleString()}</p>
            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong>Date Added:</strong> {property.dateAdded}</p>
            <p>{property.description}</p>
            <button
              className={`btn ${favorites.some((fav) => fav.id === property.id)
                ? "btn-danger"
                : "btn-outline-danger"
                }`}
              onClick={() => handleAddToFavorites()}
            >
              {favorites.some((fav) => fav.id === property.id)
                ? "Remove Favorite"
                : "Add to Favorite"}
            </button>
          </div>
        </div>

        {/* Google Map */}
        <div className="row mt-4">
          <div className="col-12">
            <h4>Location Map</h4>
            <iframe
              title="Google Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                property.address
              )}&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>
      <footer className="bg-light text-center text-lg-start mt-5">
        <div className="text-center p-3" style={{ backgroundColor: "#f8f9fa" }}>
          &copy; {new Date().getFullYear()} Property Finder. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default PropertyDetails;
