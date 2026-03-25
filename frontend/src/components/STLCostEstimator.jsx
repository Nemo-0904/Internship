import React, { useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const materialOptions = {
  PLA: { density: 1.24, costPerGram: 2.0 },
  PETG: { density: 1.27, costPerGram: 2.5 },
  TPU: { density: 1.21, costPerGram: 3.5 },
};

const calculateVolume = (geometry) => {
  const position = geometry.attributes.position;
  let volume = 0;
  for (let i = 0; i < position.count; i += 3) {
    const ax = position.getX(i);
    const ay = position.getY(i);
    const az = position.getZ(i);
    const bx = position.getX(i + 1);
    const by = position.getY(i + 1);
    const bz = position.getZ(i + 1);
    const cx = position.getX(i + 2);
    const cy = position.getY(i + 2);
    const cz = position.getZ(i + 2);

    const v321 = cx * by * az;
    const v231 = bx * cy * az;
    const v312 = cx * ay * bz;
    const v132 = ax * cy * bz;
    const v213 = bx * ay * cz;
    const v123 = ax * by * cz;

    volume += (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
  }
  return Math.abs(volume); // mm³
};

const STLCostEstimator = () => {
  const [material, setMaterial] = useState('PLA');
  const [infill, setInfill] = useState(20);
  const [price, setPrice] = useState(null);
  const [weight, setWeight] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    const loader = new STLLoader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const geometry = loader.parse(arrayBuffer);

      const vol_mm3 = calculateVolume(geometry);
      const vol_cm3 = vol_mm3 / 1000;
      const effectiveVol = vol_cm3 * (infill / 100);

      const { density, costPerGram } = materialOptions[material];
      const weight_g = effectiveVol * density;
      const costMaterial = weight_g * costPerGram;
      const costShipping = weight_g * 0.5;
      const totalCost = costMaterial + costShipping;

      setWeight(weight_g.toFixed(2));
      setPrice(totalCost.toFixed(2));
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm mb-6">
      <label><strong>Upload STL:</strong></label>
      <input type="file" accept=".stl" onChange={handleFileUpload} className="block mb-4" />

      <label><strong>Material:</strong></label>
      <select
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
        className="block mb-4"
      >
        {Object.keys(materialOptions).map((mat) => (
          <option key={mat} value={mat}>{mat}</option>
        ))}
      </select>

      <label><strong>Infill Percentage (%):</strong></label>
      <input
        type="number"
        value={infill}
        onChange={(e) => setInfill(Number(e.target.value))}
        min={1}
        max={100}
        className="block mb-4"
      />

      {price && (
        <div className="mt-4 bg-green-100 p-3 rounded">
          <p><strong>Model:</strong> {fileName}</p>
          <p><strong>Estimated Weight:</strong> {weight} g</p>
          <p><strong>Total Price:</strong> ₹{price}</p>
        </div>
      )}
    </div>
  );
};

export default STLCostEstimator;
