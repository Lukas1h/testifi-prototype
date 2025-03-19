import { useState } from "react";
import Chat from "./Chat";

// function Card() {
//   return (
//     <div className=" p-8 m-8 bg-grey rounded-3xl border-2">
//       <p>
//         Can you tell me about a moment in your life when you first started
//         thinking about <span>God</span> or feeling like something was missing?
//       </p>
//     </div>
//   );
// }

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="">
        <Chat />
      </div>
    </>
  );
}

export default App;
