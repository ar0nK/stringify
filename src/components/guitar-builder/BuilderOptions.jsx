import React from "react";
import OptionSelect from "./OptionSelect";

export default function BuilderOptions({ config, updateOption }) {

  return (
    <div className="builder-options">

      <h5 className="mb-3">Gitár konfiguráció</h5>

      <OptionSelect
        label="Test"
        value={config.body}
        onChange={(v) => updateOption("body", v)}
        options={[
          { label: "Fekete", value: "body_black.png" },
          { label: "Piros", value: "body_red.png" },
          { label: "Kék", value: "body_blue.png" }
        ]}
      />

      <OptionSelect
        label="Pickguard"
        value={config.pickguard}
        onChange={(v) => updateOption("pickguard", v)}
        options={[
          { label: "Fehér", value: "pickguard_white.png" },
          { label: "Fekete", value: "pickguard_black.png" }
        ]}
      />

      <OptionSelect
        label="Nyak"
        value={config.neck}
        onChange={(v) => updateOption("neck", v)}
        options={[
          { label: "Juhar", value: "neck_maple.png" },
          { label: "Rosewood", value: "neck_rosewood.png" }
        ]}
      />

    </div>
  );
}