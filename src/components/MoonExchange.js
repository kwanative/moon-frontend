import React, { useState, useEffect } from "react";
import {
  getMoon,
  updateMoon,
  addTransaction,
  getAllTransactions,
} from "../services/BackendService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function MoonExchange() {
  const [disabledBtn, setDisabledBtn] = useState("disabled");
  const [disabledInput, setDisabledInput] = useState("");
  const [thbtTotalBalance, setThbtTotalBalance] = useState();
  const [moonTotal, setMoonTotal] = useState();
  const [moonPrice, setMoonPrice] = useState();
  const [thbtBalance, setTHBTBalance] = useState(100);
  const [thbtInput, setThbtInput] = useState("");
  const [moonAmtInput, setMoonAmtInput] = useState("");
  const [slippage, setSlippage] = useState("");
  const [thbtBalanceError, setThbtBalanceError] = useState("");
  const [moonBalanceError, setMoonBalanceError] = useState("");
  useEffect(() => {
    getMoonAmount();
    setThbtTotalBalance(100);
  }, []);

  const getMoonAmount = async () => {
    const response = await getMoon();
    if (response.status === 200) {
      let moonTotal = response.data ? response.data.moonBalance : 0;
      let moonPrice = response.data ? response.data.latestPrice : 0;
      // console.log("moonTotal", moonTotal);
      // console.log("moonPrice", moonPrice);
      if (moonTotal !== 0) {
        setMoonPrice(moonPrice);
        setMoonTotal(moonTotal);
        if (moonTotal < 1000 && moonTotal % 10 === 0) {
          moonPrice = 50 + (50 * 10) / 100;
          setMoonPrice(moonPrice);
          setMoonTotal(moonTotal);
        }
      } else {
        setMoonPrice(moonPrice);
        setDisabledInput("disabled");
        MySwal.fire({
          title: <p>Sorry, we ran out of MOON :'(</p>,
          showConfirmButton: false,
          didOpen: () => {
            // `MySwal` is a subclass of `Swal`
            //   with all the same instance & static methods
            // MySwal.clickConfirm()
          },
        }).then(() => {
          // return MySwal.fire(<p>Sorry, run out of Moon</p>)
        });
      }
    } else {
      MySwal.fire({
        title: <p>Something went wrong!</p>,
        didOpen: () => {
          MySwal.clickConfirm();
        },
      });
    }
  };

  const handleOnChangeTHBT = (e) => {
    setThbtInput(e.target.value);
    console.log("handleOnChangeTHBT moonAmt", moonAmtInput);
    if (e.target.value !== "" && slippage !== "" && moonAmtInput !== "") {
      setDisabledBtn("");
    } else {
      setDisabledBtn("disabled");
    }

    if (e.target.value > thbtBalance) {
      setThbtBalanceError("You have not enough THBT");
      setMoonAmtInput("");
    } else {
      setThbtBalanceError("");
      let moonAvg = e.target.value / moonPrice;
      setMoonAmtInput(moonAvg);
      if (moonAvg < moonTotal) {
        setMoonBalanceError("");
      }
    }
  };

  const handleOnChangeMoon = (e) => {
    console.log("moonTotal", moonTotal);
    setMoonAmtInput(e.target.value);

    if (e.target.value === "") {
      setThbtInput("");
      setDisabledBtn("disabled");
    } else if (e.target.value > moonTotal) {
      setMoonBalanceError("Not enough MOON");
      setThbtBalanceError("");
      setThbtInput("");
      setDisabledBtn("disabled");
    } else {
      setMoonBalanceError("");
      let thbtAvg = e.target.value * moonPrice;
      if (thbtAvg < thbtBalance || thbtAvg === thbtBalance) {
        setThbtInput(thbtAvg);
        setThbtBalanceError("");
        if (e.target.value !== "" && slippage !== "" && thbtAvg !== "") {
          setDisabledBtn("");
        } else {
          setDisabledBtn("disabled");
        }
      } else {
        setThbtBalanceError("You have not enough THBT");
        setThbtInput("");
      }
    }
  };

  const handleOnChangeSlippage = (e) => {
    setSlippage(e.target.value);
    if (e.target.value !== "" && thbtInput !== "" && moonAmtInput !== "") {
      setDisabledBtn("");
    } else {
      setDisabledBtn("disabled");
    }
  };

  const buyMoon = async () => {
    const today = new Date();
    let thbtTotalBalance = thbtBalance - thbtInput;
    setThbtTotalBalance(thbtTotalBalance);
    var time =
      today.getHours() +
      "" +
      ("0" + today.getMinutes()).slice(-2) +
      "" +
      ("0" + today.getSeconds()).slice(-2) +
      "" +
      ("0" + today.getMilliseconds()).slice(-2);

    var transactionId =
      today.getFullYear() +
      "" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "" +
      ("0" + today.getDate()).slice(-2) +
      "" +
      time;

    const slipGt = moonPrice + (slippage * 10) / 100;
    const slipLt = moonPrice - (slippage * 10) / 100;
    if (moonPrice > slipLt && moonPrice < slipGt) { 
      const responsAllTransactions = await getAllTransactions();
      const moonAmt = Number(Math.round(moonAmtInput + "e" + 11) + "e-" + 11);
      const rate = (1 / moonPrice).toFixed(11);
      const rate1 = "1 MOON = " + moonPrice + " THBT | " + rate;
      var body = {
        transactionId: transactionId,
        dateTime: today.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        thbtAmount: thbtInput,
        moonAmount: moonAmt,
        rate: rate1,
      };
      // console.log("body", body);
      const response = await addTransaction(body);
      // console.log("addTransaction response", response);
      if (response.status === 200) {
        var moonBalance = moonTotal - moonAmtInput;
        console.log("moonBalance ", moonBalance);
        var bodyMoon = {
          moonBalance: moonBalance,
          latestPrice: moonPrice,
        };
        const updateMoonResponse = await updateMoon(bodyMoon);
        console.log("updateMoon response", updateMoonResponse);
        if (updateMoonResponse.status === 200) {
          window.location.href = "/summary?param=" + transactionId;
        } else {
          window.location.href = "/summary?param=error";
        }
      } else {
        window.location.href = "/summary?param=error";
      }
    } else {
      MySwal.fire({
        title: <p>Current price is more than your slippage!</p>,
        didOpen: () => {
          MySwal.clickConfirm();
        },
      });
    }
  };

  return (
    <div>
      <h2>
        MOON = <label data-atd="moon-price-label">{moonPrice}</label> THBT
      </h2>
      <h3>
        You have <label data-atd="balance-label">{thbtTotalBalance}</label> THBT
      </h3>
      <br />
      <label>Amount to buy (THBT)</label>
      <br />
      <input
        data-atd="thbt-input"
        type="number"
        onChange={handleOnChangeTHBT}
        value={thbtInput}
        disabled={disabledInput}
      />
      <br />
      <label className="text-danger">{thbtBalanceError}</label>
      <br />
      <br />
      <label>Amount MOON</label>
      <br />
      <input
        data-atd="moon-input"
        type="number"
        onChange={handleOnChangeMoon}
        value={moonAmtInput}
        disabled={disabledInput}
      />
      <br />
      <label className="text-danger">{moonBalanceError}</label>
      <br />
      <br />
      <label>Slippage Tolerance (%)</label>
      <br />
      <input
        data-atd="slippage-input"
        type="number"
        onChange={handleOnChangeSlippage}
        value={slippage}
        disabled={disabledInput}
      />
      <br />
      <br />
      <button
        data-atd="buy-btn"
        className="buy-btn"
        onClick={buyMoon}
        disabled={disabledBtn}
      >
        Buy
      </button>
    </div>
  );
}
