import React, { useEffect, useState } from 'react';
import '../App.css';
import {Box, Typography} from '@material-ui/core';
import { getMoon, getAllTransactions } from '../services/BackendService';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HistoryDetail() {
  const [status, setStutus] = useState('Success');
  const [moonBalance, setMoonBalance] = useState('');
  const [transactionList, setTransactionList] = useState('');
  useEffect(() => {
    getMoonBalnace();
    getTransactionList();
  }, []);

  const getMoonBalnace = async () => {
    const response = await getMoon();
    console.log('getMoonBalnace response', response);
    setMoonBalance(response.data.moonBalance);
  }

  const getTransactionList = async () => {
    const response = await getAllTransactions();
    console.log('getAllTransaction response ', response.data)
    if (response.status === 200) {
      const data = response.data;
      console.log('', data);
      setTransactionList(data);
    }else {
      setStutus('Error');
    }
    // return vars;
  }
  

  return (
    <div>
      <label>MOON left {moonBalance} MOON</label>
      <br/>
      <br/>
      <div className='row'>
                <div className='col-md-3'>
                    <b>Date - Time</b>
                </div>
                <div className='col-md-2'>
                    <b>ID</b>                 
                </div>
                <div className='col-md-1'>
                  <b>THBT</b>
                </div>
                <div className='col-md-1'>
                    <b>MOON</b>
                </div>
                <div className='col-md-5'>
                    <b>RATE</b>
                </div>
              </div>
       {transactionList.length > 0
        ? transactionList.map((item, index) => {
            return (
              <div className='row'>
                <div className='col-md-3'>
                    {item.dateTime}
                </div>
                <div className='col-md-2'>
                    {item.transactionId}
                 
                </div>
                <div className='col-md-1'>
                    {item.thbtAmount}
                 
                </div>
                <div className='col-md-1'>
                    {item.moonAmount}
                </div>
                <div className='col-md-5'>
                    {item.rate}
                </div>
              </div>
            );
        }
        )
        : ''} 
    </div>
  );
}