// App.jsx
import React from 'react';
import TrackingComponent from './TrackingComponent';
import ChatComponent from './ChatComponent';

const App = () => {
  return (
    <div>
      <div style={{ width: '100%', float: 'top' }}>
        <TrackingComponent />
      </div>
      <div style={{ width: '100%', float: 'bottom' }}>
        <ChatComponent />
      </div>
    </div>
  );
};

export default App;
