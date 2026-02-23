import React from "react";

export default function PriceBox({ config }) {

  const prices = {
    body_black: 120000,
    body_red: 130000,
    body_blue: 125000
  };

  const bodyKey = config.body.replace(".png", "");

  const total = prices[bodyKey] || 100000;

  return (
    <div className="builder-price-box text-center">

      <h4 className="fw-bold">Teljes ár</h4>

      <div className="builder-price">
        {total.toLocaleString("hu-HU")} Ft
      </div>

      <button className="btn btn-danger w-100 mt-3">
        Kosárba
      </button>

    </div>
  );
}