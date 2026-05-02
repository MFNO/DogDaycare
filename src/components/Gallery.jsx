import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Image, Typography, Empty, Grid } from "antd";
import { site } from "../config/site.js";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const galleryModules = import.meta.glob(
  "../assets/gallery/*.{png,jpg,jpeg,gif,svg,webp,avif}",
  {
    eager: true,
    import: "default",
  },
);

const gallerySrcs = Object.keys(galleryModules)
  .sort()
  .map((key) => galleryModules[key]);

function GalleryPrevArrow({ className, style, onClick }) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      aria-label="Previous image"
    >
      <LeftOutlined />
    </button>
  );
}

function GalleryNextArrow({ className, style, onClick }) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      aria-label="Next image"
    >
      <RightOutlined />
    </button>
  );
}

export default function Gallery() {
  const screens = useBreakpoint();
  const pad = screens.sm ? 56 : 32;

  return (
    <div style={{ padding: `${pad}px 16px`, maxWidth: 800, margin: "0 auto" }}>
      <Title
        level={screens.xs ? 3 : 2}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        {site.sections.gallery}
      </Title>
      {gallerySrcs.length === 0 ? (
        <Empty description="Add images to src/assets/gallery/" />
      ) : (
        <Carousel
          rootClassName="site-gallery-carousel"
          arrows
          prevArrow={<GalleryPrevArrow />}
          nextArrow={<GalleryNextArrow />}
          autoplay
          autoplaySpeed={5000}
          effect="fade"
          dots
          dotPosition="bottom"
          draggable
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          {gallerySrcs.map((src, index) => (
            <div key={src}>
              <div className="site-gallery-carousel__slide">
                <Image
                  src={src}
                  alt={`${site.businessName} gallery ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 650,
                    width: "auto",
                    height: "auto",
                    display: "block",
                  }}
                  preview={{
                    mask: "View",
                  }}
                />
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}
