import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import axios from "axios";
import { Button } from "../components/ui";
// import { baseURL } from "../utils";
import { BACKEND_URL } from "../config";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// interface RiskInputs {
//   val: number;
// }

export function Game() {
  const [betAmount, setBetAmount] = useState(0.0);
  const [riskInputs, setRiskInputs] = useState(1);
  const [displayAmount, setDisplayAmount] = useState(0.0);
  const [profitLoss, setProfitLoss] = useState(0.0);
  const [dis, setDis] = useState(false)
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [loading,setLoading]=useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    

    if (!localStorage.getItem("token")) {
      alert("Please Login")
      navigate("/login")
    }
    if (canvasRef.current) {
      console.log("Hello")
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        riskInputs as number,
      );
      setBallManager(ballManager);
    }
  

  const getWallet = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${BACKEND_URL}/api/game/wallet`, {
        headers: {
          Authorization: token
        }
      })

      setDisplayAmount(response.data.money.toFixed(2))
    }

    catch (e) {
      console.error(e);

    }
  }


  getWallet()

}, [canvasRef, riskInputs]);

const removeHidden = () => {
  const dummy = document.getElementById('dropdownDivider')
  if (dummy) {
    dummy.classList.toggle('hidden')
  }
}


return (

  <div className=" bg-[url('src/assets/bg-image-blue.webp')] ">
    <Navbar />

    <div className="flex justify-evenly">

      <div className="bg-black flex flex-col justify-center min-w-96 mt-12  ">



        <div className="max-w-sm mx-auto  ">
          <div>
            <label className="block mb-2 text-lg font-medium text-white">Wallet</label>
            <div id="number" className="shadow-sm  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"  >$ {displayAmount}</div>

          </div>
          <div className="mb-5">
            <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 text-white">Bet Amount</label>
            <div></div>
            <input onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) {
                setBetAmount(value);
              } else if (value > displayAmount) {
                e.target.value = "";
              }
              else{
                setBetAmount(value)
              }

            }} type="number" id="number" className="shadow-sm  border border-gray-300 text-gray-900 text-sm rounded-lg font-semibold focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="0.0" required />
           <div className={`${betAmount > displayAmount ? "text-red-500 font-bold mt-2" : 'hidden'}`}> You don't have enough money </div>
           <div className={`${betAmount < 0 ? "text-red-500 font-bold mt-2" : 'hidden'}`}> Please enter a positive number </div>
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 text-white">Win or lose amount</label>

            <div id="number" className={`shadow-sm border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block font-bold w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light ${profitLoss == 0 ? 'text-white' : ""}  ${profitLoss > 0 ? 'text-green-500' : 'text-red-500'} `}>$ {profitLoss.toFixed(2)}</div>
          </div>

          {/* Dropdown menu */}
          <div className="flex flex-col">
            <button onClick={removeHidden} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="min-w-64 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Risk<svg className="w-2.5 h-2.5 ms-3 md:ml-64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
            </button>
            <div id="dropdownDivider" className="min-w-80 z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul className="min-w-80 py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                <li className="">
                  <button onClick={() => { setRiskInputs(1); removeHidden() }} className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Low</button>
                </li>
                <li>
                  <button onClick={() => { setRiskInputs(2); removeHidden() }} className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Medium</button>
                </li>
                <li>
                  <button onClick={() => { setRiskInputs(3); removeHidden() }} className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">High</button>
                </li>
              </ul>

            </div>



            <Button
              className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={async () => {
                const baby = localStorage.getItem("token")
                console.log(baby)
                if (betAmount == 0) {
                  alert('Please enter a bet amount')
                }
                else if (betAmount > displayAmount) {
                  alert("You don't have enough money in your wallet")
                }
                else {
                  const response = await axios.post(`${BACKEND_URL}/api/game/playGame`, {

                    bet: betAmount,
                    risk: riskInputs
                  }, {
                    headers: {
                      Authorization: localStorage.getItem("token")
                    }
                  });
                 
                   
                  
                  
                  if (ballManager) {
                    ballManager.addBall(response.data.point);
                    
                  }
                  
                  
                  setDisplayAmount(response.data.walletAmount.money.toFixed(2))
                  setProfitLoss(response.data.profitLoss)
                  
                  console.log(response)
                }

              }}
            >
              Add ball
            </Button>

          </div>

        </div>

      </div>

      <div className="">
        <div className="mt-11">
          <canvas ref={canvasRef} width="800" height="800"></canvas>
        </div>
        <div className="flex justify-center">

        </div>
      </div>
    </div>

  </div>
);
}
