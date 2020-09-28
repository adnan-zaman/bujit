import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


const ACC_DATA = [];

ReactDOM.render(
  <React.StrictMode>
    <App accounts={ACC_DATA}/>
  </React.StrictMode>,
  document.getElementById('root')
);

