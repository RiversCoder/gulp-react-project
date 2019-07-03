import React from 'react';
import ReactDOM from 'react-dom';
import Parent from './Parent.js'
import  css from '../css/style.css'

console.log(css)

ReactDOM.render(
  <Parent />,
  document.getElementById('app')
);