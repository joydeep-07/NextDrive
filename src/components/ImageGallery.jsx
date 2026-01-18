import React from "react";

const ImageGallery = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Heading */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-6xl font-heading font-medium text-[var(--text-main)]">
          Our Latest <span className="text-[var(--accent-primary)]"> Creations</span>
        </h1>

        <p className="text-sm text-[var(--text-secondary)] max-w-lg">
          A visual collection of our most recent works each piece crafted with <br />
          intention, emotion, and style.
        </p>
      </div>

      {/* Gallery */}
      <div className="flex items-center gap-2 h-[400px] w-full mt-10">
        {[
          "1719368472026-dc26f70a9b76",
          "1649265825072-f7dd6942baed",
          "1555212697-194d092e3b8f",
          "1729086046027-09979ade13fd",
          "1601568494843-772eb04aca5d",
          "1585687501004-615dfdfde7f1",
        ].map((id, index) => (
          <div
            key={index}
            className="
              relative group flex-grow
              transition-all duration-500
              w-56 hover:w-full
              h-[400px]
              rounded-lg overflow-hidden
            "
          >
            <img
              src={`https://images.unsplash.com/photo-${id}?q=80&h=800&w=800&auto=format&fit=crop`}
              alt="gallery"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
