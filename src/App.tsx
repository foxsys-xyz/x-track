import React from 'react';
import ReactDOM from 'react-dom';
import Window from './Window/Window';
import reportWebVitals from './reportWebVitals';
import ActionBar from './ActionBar/ActionBar';

ReactDOM.render(
  <React.StrictMode>
    <ActionBar />
    <Window />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
