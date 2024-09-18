import { useEffect, useRef } from "react";
import Hls from "hls.js";

const ReproductorM3U8 = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Verifica si el navegador soporta HLS nativo
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    }

    return () => {
      if (Hls.isSupported()) {
        videoRef.current?.hls?.destroy();
      }
    };
  }, [url]);

  return <video ref={videoRef} controls style={{ width: "100%" }} />;
};

export default ReproductorM3U8;
