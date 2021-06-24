import React, { useEffect, useState } from 'react';
import '../App.css';
import { getTransaction } from '../services/BackendService';

export default function SummaryDetail() {
  const [status, setStutus] = useState('Success');
  const [moonAmt, setMoonAmt] = useState('');
  const [thbtAmt, setTHBTAmt] = useState('');
  const [youTxt, setYouTxt] = useState('You bought ');
  const [moonTxt, setMoonTxt] = useState(' MOON');
  const [withTxt, setWithTxt] = useState('with ');
  const [thbtTxt, setThbtTxt] = useState(' THBT');
  const [backUrl, setBackUrl] = useState('');
  useEffect(() => {
    getUrlVars();
  
  }, []);

  const getUrlVars = async () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    console.log('vars', vars.param);
    setBackUrl('/home');
    if (vars.param !== 'error') {
      const response = await getTransaction(vars.param);
      console.log('getTransaction response ', response.data)
      if (response.status === 200) {
        const data = response.data;
        setMoonAmt(data.moonAmount);
        setTHBTAmt(data.thbtAmount);
      }else {
        setStutus('Error');
        setYouTxt('');
        setMoonAmt('');
        setMoonTxt('');
        setWithTxt('');
        setTHBTAmt('');
        setThbtTxt('');
      }
    } else {
        setStutus('Error');
        setYouTxt('');
        setMoonAmt('');
        setMoonTxt('');
        setWithTxt('');
        setTHBTAmt('');
        setThbtTxt('');
    }
    
    // return vars;
  }
  

  return (
    <div>
      <label><h1>{status}</h1></label>
      <br />
      <br />
      {youTxt} <label data-atd="success-moon-label">{moonAmt}</label> {moonTxt}
      <br />
      {withTxt} <label data-atd="success-thbt-label">{thbtAmt}</label> {thbtTxt}
      <br />
      <br />
      <a href = {backUrl} data-atd="back-btn">back to Buy</a>
    </div>
  );
}