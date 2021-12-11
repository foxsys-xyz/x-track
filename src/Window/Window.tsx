  
import { useState } from 'react';
import Boot from '../Boot/Boot';
import Login from '../Login/Login';
import '../Assets/index.css';

function Window() {
    const [state, setState] = useState('BOOT');

    switch (state) {
      case 'BOOT':
          setTimeout(() => {
            setState('LOGIN');
          }, 15000);
          return <Boot />;
      case 'LOGIN':
          return <Login />;
    }

    return (
      <div>
        app missed the state. please restart.
      </div>
    );
}

export default Window;
