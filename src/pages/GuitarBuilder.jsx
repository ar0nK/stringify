import React, { useState } from "react";
import NavBar from "../components/NavBar";
import BuilderCanvas from "../components/guitar-builder/BuilderCanvas";
import BuilderOptions from "../components/guitar-builder/BuilderOptions";
import PriceBox from "../components/guitar-builder/PriceBox";
import "../style/GuitarBuilder.css";

export default function GuitarBuilder() {

  // ===== builder state =====
  const [config, setConfig] = useState({
    type: "strat",

    body: "body_black.png",
    pickguard: "pickguard_white.png",
    neck: "neck_maple.png",
    bridge: "bridge_standard.png",
    headstock: "headstock_fender.png"
  });

  const updateOption = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <NavBar />

      <div className="container-fluid builder-container">
        <div className="row gx-4">

          {/* BAL OLDAL — OPCIÓK */}
          <div className="col-lg-3 col-md-4">
            <BuilderOptions
              config={config}
              updateOption={updateOption}
            />
          </div>

          {/* KÖZÉP — CANVAS */}
          <div className="col-lg-6 col-md-8 d-flex justify-content-center align-items-center">
            <BuilderCanvas config={config} />
          </div>

          {/* JOBB OLDAL — ÁR */}
          <div className="col-lg-3">
            <PriceBox config={config} />
          </div>

        </div>
      </div>
    </>
  );
}