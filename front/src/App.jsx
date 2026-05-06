import Recorder from "./components/Recorder";
import Inbox from "./components/Inbox";
import { useState } from "react";

function App() {
    const [reload, setReload] = useState(false);

    function atualizarInbox() {
        setReload(!reload);
    }

    return (
        <div>
            <Recorder onUpload={atualizarInbox} />
            <Inbox reload={reload} />
        </div>
    );
}

export default App;