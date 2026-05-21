import { Layout } from "antd";
import SiteHeader from "./components/SiteHeader.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Gallery from "./components/Gallery.jsx";
import Reviews from "./components/Reviews.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ContactForm from "./components/ContactForm.jsx";

const { Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <SiteHeader />
      <Content style={{ marginTop: 64 }}>
        <section id="hero" aria-label="Hero">
          <Hero />
        </section>
        <section id="about" aria-label="About">
          <About />
        </section>
        <section id="services" aria-label="Services">
          <Services />
        </section>
        <section id="gallery" aria-label="Gallery">
          <Gallery />
        </section>
        <section id="reviews" aria-label="Reviews">
          <Reviews />
        </section>
        <section id="contact" aria-label="Contact and booking">
          <ContactForm />
        </section>
      </Content>
      <SiteFooter />
    </Layout>
  );
}
