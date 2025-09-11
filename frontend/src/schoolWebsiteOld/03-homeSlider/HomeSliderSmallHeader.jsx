import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import 'owl.carousel/dist/assets/owl.carousel.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import "./home-slide.scss";



const SliderCarousel = ({ sliders = [] }) => {
  const [slideItems, setSlideItems] = useState(sliders);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
  axios.get(`${apiUrl}/slides/`, { withCredentials: true })
    .then(async (res) => {
      setSlideItems(res.data);

      await import('owl.carousel/dist/owl.carousel');

      // Wait for DOM render
      setTimeout(() => {
        const $carousel = $('.owl-carousel');

        if ($carousel.hasClass('owl-loaded')) {
          $carousel.trigger('destroy.owl.carousel');
        }

        $carousel.owlCarousel({
          loop: true,
          margin: 0,
          nav: false,
          dots: false,
          items: 1,
          autoplay: true,
          autoplayTimeout: 5000,
          smartSpeed: 200,
          animateOut: 'fadeOut',
          navText: [
            "<i class='fa-solid fa-arrow-left'></i>",
            "<i class='fa-solid fa-arrow-right'></i>"
          ]
        });

        // ✅ Wait another short delay for React DOM to finish
        setTimeout(() => {
          const wordsWrapper = document.querySelector('.cd-words-wrapper');
          if (!wordsWrapper) return;

          const words = wordsWrapper.querySelectorAll('b');
          // console.log("words: ", words);
          if (words.length === 0) return;

          let currentIndex = 0;

          function changeWord() {
            const currentWord = words[currentIndex];
            const nextIndex = (currentIndex + 1) % words.length;
            const nextWord = words[nextIndex];

            wordsWrapper.style.width = '0px';

            setTimeout(() => {
              currentWord.classList.remove('is-visible');
              currentWord.classList.add('is-hidden');
            }, 700);

            setTimeout(() => {
              nextWord.classList.remove('is-hidden');
              nextWord.classList.add('is-visible');
              wordsWrapper.style.width = `${nextWord.clientWidth}px`;
            }, 1000);

            currentIndex = nextIndex;
          }

          // Initialize
          wordsWrapper.style.width = `${words[0].clientWidth}px`;
          const intervalId = setInterval(changeWord, 4000);

          // ✅ Clean up on unmount
          return () => clearInterval(intervalId);
        }, 300); // allow time for DOM

      }, 100); // allow time for Owl DOM
    })
    .catch((err) => console.error("Slider fetch error:", err));
}, []);


  return (
    <div className="container">

    
      <div className="owl-carousel owl-theme">
        
        {slideItems.map((slide, index) => (
          <div
            key={slide.id || index}
            className="item"
            style={{
              backgroundImage: `url('${slide.image_url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              // backgroundColor: "red",
            }}
          >
            <div className="container slider-body">
              <div className="slider-title">
                {/* <div className="title">{slide.title}</div> */}
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default SliderCarousel;
