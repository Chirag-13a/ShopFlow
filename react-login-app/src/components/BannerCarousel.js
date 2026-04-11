import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banners = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
  "/images/banner4.jpg",
  "/images/banner5.jpg"
];

const BannerCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
  };

  return (
    <div className="banner-carousel">
      <Slider {...settings}>
        {banners.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Banner ${idx + 1}`}
            className="banner-img"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;
