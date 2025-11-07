
const phrases = [ 
  "জ্ঞান, নৈতিকতা ও উৎকর্ষের পথে আমরা",
  "আধুনিক শিক্ষা, মূল্যবোধের ভিত্তি",
  "স্বপ্নকে বাস্তবে রূপ দিতে আমরা সঙ্গী",
  "শিক্ষার মাধ্যমে গড়ে উঠুক নতুন প্রজন্ম",
  "মানসম্মত শিক্ষা, সফলতার প্রথম পদক্ষেপ",
  "শিক্ষা ও সংস্কৃতির মেলবন্ধনে আমরা",
  "জ্ঞানের আলো ছড়িয়ে দিচ্ছি প্রতিটি মনে",
];

const SliderHeadline = () => {
  
  return (
    <div className="slider-animation-text">
      
      <span className="cd-headline clip">
        <span className="cd-words-wrapper">
          {phrases.map((text, index) => (
            <b
              key={index}
              className={index === 0 ? "is-visible" : "is-hidden"}
            >
              {text}
            </b>
          ))}
        </span>
        <span className="cursor"></span>
      </span>
    </div>
  );
};

export default SliderHeadline;
