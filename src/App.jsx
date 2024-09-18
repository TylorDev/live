import { useRef, useState, useEffect } from "react";
import "./App.scss";
import screenfull from "screenfull";
import uno from "./assets/uno.png";
import { MdFullscreen, MdOutlineScreenSearchDesktop } from "react-icons/md";
import HlsPlayer from "react-hls-player";
import { TbLivePhotoFilled } from "react-icons/tb";
import { IoReloadCircle } from "react-icons/io5";
import ReactPlayer from "react-player";
function App() {
  function parseUrl(url) {
    // Definir la expresión regular para extraer el server y list
    const regex = /^(https:\/\/[^/]+\/)(.*)$/;
    const match = url.match(regex);

    if (match) {
      return {
        server: match[1],
        list: match[2],
      };
    } else {
      throw new Error("La URL no coincide con el formato esperado.");
    }
  }

  const urls = {
    uno: {
      name: "Red Uno ",
      url: "/uno/sec2(rLpwKarbl1e8Ue5HuoqU3-hi5_EOjE4ujZISujMrFBuRfSkzKn_tejKDDxYItoNnxzUZ2tYYoUafXuDdsy3fmPqPZgkdrT5qk9umO5cOxsw)/dm/3/x91tbcm/d/live-720.m3u8#cell=lcfb",
    },
    rede: {
      name: "Rede TV ",
      url: "/rede/sec2(EBzIwHvdXN-i2CH3UgCWvEprHZfEX4r_R1Gf0dQrSFwCWyPwLijD1Ryvl2liK7LVsh6CoPoBIy-xeZu7haBTlOXr3yjLXZgVnBb3l9uMWBg)/dm/3/x8xps0s/d/live-1080.m3u8#cell=lcfb",
    },
    sbt: {
      name: "SBT",
      url: "https://youtu.be/ABVQXgr2LW4",
    },
    globo: {
      name: "GLOBO",
      url: "https://live-02.edge-vivo-vun-sp.video.globo.com/j/eyJhbGciOiJSUzUxMiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJjb3VudHJ5X2NvZGUiOiJCUiIsImRvbWFpbiI6ImxpdmUtMDIuZWRnZS12aXZvLXZ1bi1zcC52aWRlby5nbG9iby5jb20iLCJleHAiOjE3MjY1MjcwMzksImlhdCI6MTcyNjQ0MDYzOSwiaXNzIjoicGxheWJhY2stYXBpLXByb2QtZ2NwIiwib3duZXIiOiI2YjkwMTMyOC1kMjYwLTQwZDQtOGVhYi1lNDhlMmUzZmFiNTAiLCJwYXRoIjoiL251L2YoaT0yKS9nbG9iby1zcDEvcGxheWxpc3QubTN1OCJ9.HcBRfR6UODBrNZvKvWliruGEr-mm-UOiQnpE7ahT5QISV8-HPZg19t-D_xda8655LA3NfOiSOs8bARfsmbt154wtFd4Gjt2H8IXQDNY4tZs7CpgHBTn_wDRJ61LdMhzn_tOstDZrVjA24-KujP_YIDKH62qIlfzdnRPm2TImmhVUxcbWJ_jd684_Xpim1-mTio6CV-CupPXABW9Gg2rskKGSxGAIgphZxe6OFPfmAjDy_ONeofGWD8_I9vdmewMYN9TCOPhisXqOa_5Pjgr-xB7GCCchtAhfIENaatxIkzjwe03BBXP2cagrVb6AF39nDkwpBPSwtMGxigabdFtYRg/nu/f(i=2)/globo-sp1/playlist.m3u8?originpath=/linear/hls/pa/event/UNTWwQcWQtmVxARzvTvEBg/stream/c1b06a93-add3-46d5-a214-10f91d141ad3:SCL/variant/c966b8cc25351d28c43a55d2fe9954c6/bandwidth/6577000.m3u8",
    },
  };

  const [url, setUrl] = useState({
    name: "Seleccione un canal ",
    url: urls.uno.url,
  });
  const playerRef = useRef(null);
  const [isHls, setIsHls] = useState(false);

  const handleClick = (prop) => {
    setUrl(prop);
    setIsHls(false);
  };

  const handleRed = (prop) => {
    setUrl(prop);
    setIsHls(true);
    playerRef.current.play();
    handleFullScreenAndPlay();
  };

  const handleFullScreenAndPlay = () => {
    const player =
      playerRef.current?.getInternalPlayer?.() || playerRef.current;

    if (!player) return;

    const requestFullScreen =
      player.requestFullscreen ||
      player.mozRequestFullScreen ||
      player.webkitRequestFullscreen ||
      player.msRequestFullscreen;

    if (requestFullScreen) {
      requestFullScreen
        .call(player)
        .then(() => {
          // Asegúrate de que el video esté en reproducción
          if (player.play) {
            player.play().catch((err) => {
              console.error("Error attempting to play the video:", err);
            });
          }
        })
        .catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
    } else {
      console.warn("Fullscreen API is not supported.");
      screenfull.request(document.querySelector(".video"));
    }
  };

  const fullWeb = () => {
    if (document.fullscreenElement) {
      // Si está en pantalla completa, salir del modo pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      // Si no está en pantalla completa, entrar en modo pantalla completa
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <div className="Reproducto">
        <div className="live">
          <span style={{ fontSize: "25px", fontWeight: "bold" }}>
            {url.name}
          </span>
          <span className="live2">
            En vivo
            <TbLivePhotoFilled />
          </span>
        </div>
        {isHls && (
          <HlsPlayer
            controls
            autoPlay
            className="video"
            playerRef={playerRef}
            src={url.url}
          />
        )}
        {isHls == false && (
          <ReactPlayer
            playing={true}
            className="video"
            ref={playerRef}
            controls={true}
            allowFullScreen
            url={url.url}
            screenfull
          />
        )}
      </div>

      <div className="canales">
        <button
          onClick={() => {
            handleRed(urls.uno);
          }}
        >
          <div>
            <img src={uno} alt="" />
          </div>
          RED UNO
        </button>
        <button
          onClick={() => {
            handleClick(urls.globo);
          }}
        >
          <div>
            <img
              src={
                "https://gkpb.com.br/wp-content/uploads/2021/12/novo-logo-da-globo-png.png"
              }
              alt=""
            />
          </div>
          <div>GLOBO</div>
        </button>
        <button
          onClick={() => {
            handleClick(urls.sbt);
          }}
        >
          <div>
            <img
              src={
                "https://www.imagensempng.com.br/wp-content/uploads/2020/12/007-2.png"
              }
              alt=""
            />
          </div>
          <div>SBT</div>
        </button>
        <button
          onClick={() => {
            handleRed(urls.rede);
          }}
        >
          <div>
            <img
              src={
                "https://www.imagensempng.com.br/wp-content/uploads/2023/05/17-1.png"
              }
              alt=""
            />
          </div>
          <div>REDE TV</div>
        </button>
      </div>
      <button
        className="button3"
        onClick={() => {
          handleFullScreenAndPlay();
        }}
        tabIndex={0}
      >
        <MdFullscreen /> Pantalla Completa
      </button>
      <button className="button1" onClick={fullWeb} tabIndex={0}>
        <MdOutlineScreenSearchDesktop /> Pagina Completa
      </button>
      <button className="button2" onClick={reloadPage} tabIndex={0}>
        <IoReloadCircle /> Recargar Pagina
      </button>
    </div>
  );
}

export default App;
