export default function StratocasterSVG({
    bodyColor,
    showPickguard,
    neckPickup,
    middlePickup,
    bridgePickup,
  }) {
    return (
      <svg
        viewBox="0 0 300 800"
        width="300"
        height="800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* BODY */}
        <path
          d="
            M150 40
            C80 40, 60 120, 80 180
            C40 260, 60 360, 120 420
            L120 700
            C120 740, 180 740, 180 700
            L180 420
            C240 360, 260 260, 220 180
            C240 120, 220 40, 150 40
            Z
          "
          fill={bodyColor}
          stroke="#222"
          strokeWidth="3"
        />
  
        {/* PICKGUARD */}
        {showPickguard && (
          <path
            d="
              M140 160
              C100 200, 100 300, 140 360
              L170 360
              C160 300, 160 200, 190 170
              Z
            "
            fill="#f5f5f5"
            opacity="0.9"
          />
        )}
  
        {/* PICKUPS */}
        {neckPickup && (
          <rect x="120" y="220" width="60" height="20" rx="5" fill="#111" />
        )}
  
        {middlePickup && (
          <rect x="120" y="280" width="60" height="20" rx="5" fill="#111" />
        )}
  
        {bridgePickup && (
          <rect x="120" y="340" width="60" height="20" rx="5" fill="#111" />
        )}
  
        {/* BRIDGE */}
        <rect x="115" y="380" width="70" height="25" fill="#555" />
  
        {/* NECK */}
        <rect x="135" y="0" width="30" height="120" fill="#c9a063" />
      </svg>
    );
  }