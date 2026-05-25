import "./Hero.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Delicious Food Delivered Fast 🍔</h1>

        <p>
          Order from your favorite restaurants
          with real-time tracking.
        </p>

        <button>Order Now</button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        alt="food"
      />
    </div>
  );
}

export default Hero;