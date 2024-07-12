import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { WIDTH } from "../game/constants";
import { pad } from "../game/padding";

export function SimulationMed() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
  });

  async function simulate(ballManager: BallManager) {
    let i = 0;
    while (true) {
      i++;
      ballManager.addBall(pad(WIDTH / 2 + 20 * (Math.random() - 0.5)));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        (index: number, startX?: number) => {
          setOutputs((outputs: any) => {
            return {
              ...outputs,
              [index]: [...(outputs[index] as number[]), startX],
            };
          });
        }
      );
      simulate(ballManager);

      return () => {
        ballManager.stop();
      };
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col lg:flex-row  items-center justify-between h-screen">
      <div className="flex mx-16 flex-col justify-center pt-10">
        {JSON.stringify(outputs, null, 2)}
      </div>
      <div className="flex flex-col items-center justify-center">
        <canvas ref={canvasRef} width="800" height="800"></canvas>
      </div>
    </div>
  );
}

   {/* <button onClick={removeHidden} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="min-w-64 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Risk<svg className="w-2.5 h-2.5 ms-3 md:ml-64"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
</svg>
</button> */}
{/* <div id="dropdownDivider" className="min-w-80 z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
    <ul className="min-w-80 py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
      <li className="">
        <button onClick={()=>{setRiskInputs(1); removeHidden()}} className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Low</button>
      </li>
      <li>
        <button onClick={()=>{setRiskInputs(2); removeHidden()}}  className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Medium</button>
      </li>
      <li>
        <button onClick={()=>{setRiskInputs(3); removeHidden()}}  className="text-left min-w-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">High</button>
      </li>
    </ul>
   
</div> */}