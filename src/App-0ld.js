
import React, { useEffect } from "react";
import Viewer from "./Viewer";
import installations from "./installations.json";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("installations")) {
      localStorage.setItem("installations", JSON.stringify(installations.installations));
    }
  }, []);

  return (
    <div>
      <Viewer installation={installations.installations[0]} />
    </div>
  );
}

export default App;