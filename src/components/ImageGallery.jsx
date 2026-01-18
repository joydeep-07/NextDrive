import React from "react";

const ImageGallery = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Our Latest Creations
      </h1>

      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        A visual collection of our most recent works - each piece crafted with
        intention, emotion, and style.
      </p>

      <div className="flex items-center gap-2 h-[400px] w-full max-w-6xl mt-10 mx-auto">
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
            className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full"
          >
            <img
              className="h-full w-full object-cover object-center"
              src={`https://images.unsplash.com/photo-${id}?q=80&h=800&w=800&auto=format&fit=crop`}
              alt="gallery"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
