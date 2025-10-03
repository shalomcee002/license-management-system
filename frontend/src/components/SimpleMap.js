import React from 'react';

const SimpleMap = () => {
  return (
    <div className="map-container">
      <h3>Map Component</h3>
      <p>This is a placeholder for the map component.</p>
      <div 
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      >
        <p>Map will be displayed here</p>
      </div>
    </div>
  );
};

export default SimpleMap;