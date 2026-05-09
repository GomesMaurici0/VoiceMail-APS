import Inbox from "./components/Inbox";
import { useState } from "react";

function App() {
    const [reload, setReload] = useState(false);

    return (
        <Inbox
            reload={reload}
            onRefresh={() => setReload((prev) => !prev)}
        />
    );
}

export default App;