import { useState, useEffect } from 'react';
import api from '../services/api';

/* ── Auto-Scrolling Gallery Slider Component ── */
const Scrolling_Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/products');
        // Pick top 8 products for gallery to ensure smooth looping
        setGalleryItems(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching gallery items', error);
      }
    };
    fetchGallery();
  }, []);

  if (galleryItems.length === 0) return null;

  return (
    <section className="gallery-slider">
      {/* Row 1 */}
      <div className="gallery-track">
        <div className="flex gap-6 pr-6">
          {galleryItems.map((item, i) => (
            <div key={`g1-r1-${i}`} className="gallery-item group">
              <div className="flex-grow flex items-center justify-center w-full mb-4">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="text-center w-full">
                <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
                <p className="text-label-sm font-medium text-[#5d5e66] truncate mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Duplicated Set for Seamless Looping */}
        <div className="flex gap-6 pr-6">
          {galleryItems.map((item, i) => (
            <div key={`g2-r1-${i}`} className="gallery-item group">
              <div className="flex-grow flex items-center justify-center w-full mb-4">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="text-center w-full">
                <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
                <p className="text-label-sm font-medium text-[#5d5e66] truncate mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 (Reverse) */}
      <div className="gallery-track reverse">
        <div className="flex gap-6 pr-6">
          {[...galleryItems].reverse().map((item, i) => (
            <div key={`g1-r2-${i}`} className="gallery-item group">
              <div className="flex-grow flex items-center justify-center w-full mb-4">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="text-center w-full">
                <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
                <p className="text-label-sm font-medium text-[#5d5e66] truncate mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Duplicated Set for Seamless Looping */}
        <div className="flex gap-6 pr-6">
          {[...galleryItems].reverse().map((item, i) => (
            <div key={`g2-r2-${i}`} className="gallery-item group">
              <div className="flex-grow flex items-center justify-center w-full mb-4">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="text-center w-full">
                <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
                <p className="text-label-sm font-medium text-[#5d5e66] truncate mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Scrolling_Gallery;
