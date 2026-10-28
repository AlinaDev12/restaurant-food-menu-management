
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FoodSection from "../components/FoodSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <FoodSection />
      </main>
      <Footer />
    </>
  );
}

export default Home;
