import React from "react";

export default function BuilderCanvas({ config }) {

  const basePath = "/assets/guitars/";

  return (
    <div className="builder-canvas">

      <img
        src={basePath + config.body}
        className="guitar-layer"
        alt=""
      />

      <img
        src={basePath + config.pickguard}
        className="guitar-layer"
        alt=""
      />

      <img
        src={basePath + config.neck}
        className="guitar-layer"
        alt=""
      />

      <img
        src={basePath + config.bridge}
        className="guitar-layer"
        alt=""
      />

      <img
        src={basePath + config.headstock}
        className="guitar-layer"
        alt=""
      />

    </div>
  );
}