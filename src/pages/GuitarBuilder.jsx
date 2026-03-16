import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import BuilderCanvas from "../components/guitar-builder/BuilderCanvas";
import BuilderOptions from "../components/guitar-builder/BuilderOptions";
import PriceBox from "../components/guitar-builder/PriceBox";
import { useAuth } from "../context/AuthContext";
import "../style/GuitarBuilder.css";

export default function GuitarBuilder() {
  const { apiBase } = useAuth();

  const canvasRef = useRef(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [selectedTestforma,  setSelectedTestforma]  = useState(null);
  const [selectedFinish,     setSelectedFinish]     = useState(null);
  const [selectedPickguard,  setSelectedPickguard]  = useState(null);
  const [selectedNeck,       setSelectedNeck]       = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/api/egyedigitar/options`)
      .then(res => {
        if (!res.ok) throw new Error("Nem sikerült betölteni az opciókat.");
        return res.json();
      })
      .then(data => {
        setOptions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiBase]);

  const handleTestformaChange = (testforma) => {
    setSelectedTestforma(testforma);
    
    if (testforma && options) {
      const defaultFinish = options.finishek.find(f => f.testFormaId === testforma.id);
      const defaultPickguard = options.pickguardok.find(p => p.testFormaId === testforma.id);
      const defaultNeck = options.nyakak[0];
      
      setSelectedFinish(defaultFinish || null);
      setSelectedPickguard(defaultPickguard || null);
      setSelectedNeck(defaultNeck || null);
    } else {
      setSelectedFinish(null);
      setSelectedPickguard(null);
      setSelectedNeck(null);
    }
  };

  return (
    <>
      <NavBar />

      <div className="container-fluid builder-container">

        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-danger" role="status" />
          </div>
        )}

        {error && (
          <div className="alert alert-danger m-4">{error}</div>
        )}

        {!loading && !error && options && (
          <div className="row gx-4">

            <div className="col-lg-3 col-md-4">
              <BuilderOptions
                testformak={options.testformak}
                finishek={options.finishek.filter(f => f.testFormaId === selectedTestforma?.id)}
                pickguardok={options.pickguardok.filter(p => p.testFormaId === selectedTestforma?.id)}
                nyakak={options.nyakak}
                selectedTestforma={selectedTestforma}
                selectedFinish={selectedFinish}
                selectedPickguard={selectedPickguard}
                selectedNeck={selectedNeck}
                onTestformaChange={handleTestformaChange}
                onFinishChange={setSelectedFinish}
                onPickguardChange={setSelectedPickguard}
                onNeckChange={setSelectedNeck}
              />
            </div>

            <div className="col-lg-6 col-md-8 d-flex justify-content-center align-items-center">
              <BuilderCanvas
                ref={canvasRef}
                key={selectedTestforma?.id}
                selectedFinish={selectedFinish}
                selectedPickguard={selectedPickguard}
                selectedNeck={selectedNeck}
                selectedTestforma={selectedTestforma}
              />
            </div>

            <div className="col-lg-3">
              <PriceBox
                selectedTestforma={selectedTestforma}
                selectedFinish={selectedFinish}
                selectedPickguard={selectedPickguard}
                selectedNeck={selectedNeck}
                canvasRef={canvasRef}
              />
            </div>

          </div>
        )}

      </div>
    </>
  );
}