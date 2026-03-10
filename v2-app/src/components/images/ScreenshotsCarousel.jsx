import styles from "./ScreenshotsCarousel.module.css";
//carousel library
import useEmblaCarousel from "embla-carousel-react";
//hooks
import { useEffect, useState, useCallback } from "react";
//icons
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function ScreenshotsCarousel({ images }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: "x" });

  const [scrollProgress, setScrollProgress] = useState(0); 
  const [loadedImages, setLoadedImages] = useState({}); //to track loaded images

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress(); //update progress
    setScrollProgress(progress);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    //on() -> subscribe to an Embla event with a callback
    emblaApi.on("scroll", onScroll); 
    emblaApi.on("reInit", onScroll); //reInit -> hard reset the carousel after it has been initialized
                                    
    onScroll();
  }, [emblaApi, onScroll]);

  const goToPrev = () => emblaApi?.scrollPrev();
  const goToNext = () => emblaApi?.scrollNext();

  const handleImageLoad = (path) => {
    setLoadedImages((prev) => ({ ...prev, [path]: true })); //mark image as loaded
  };

  if (!images?.length) return null;

  return (
    <div className={styles.embla} ref={emblaRef}>
      <div className={styles.embla_container}>
        {images.map((img) => {
          const isLoaded = loadedImages[img.file_path]; 

          return (
            <div className={styles.embla__slide} key={img.file_path}>
              {!isLoaded && <div className={styles.skeleton} />}

              <img
                src={`${IMG_BASE}${img.file_path}`}
                alt="Movie screenshot"
                className={`${styles.screenshotImg} ${
                  isLoaded ? styles.visible : styles.hidden
                }`}
                onLoad={() => handleImageLoad(img.file_path)} //path -> img key
              />
            </div>
          );
        })}
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <div className={styles.btnContainer}>
        <button className={`${styles.prevBtn} btnSecondary`} onClick={goToPrev}>
          <ArrowLeft strokeWidth={3} />
        </button>
        <button className={`${styles.nextBtn} btnSecondary`} onClick={goToNext}>
          <ArrowRight strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
