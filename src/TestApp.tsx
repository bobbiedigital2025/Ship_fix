import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>🚀 React App is Working!</h1>
      <p>If you can see this, React is rendering properly.</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
};

export default TestApp;
