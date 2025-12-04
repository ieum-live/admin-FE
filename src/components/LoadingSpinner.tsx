import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      zIndex: 50,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div className="spinner" style={{
        border: '4px solid rgba(255, 255, 255, 0.3)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        borderLeftColor: '#fff',
        animation: 'spin 1s ease infinite'
      }} />
      <p style={{ marginTop: '15px', fontSize: '18px' }}>Loading..</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
