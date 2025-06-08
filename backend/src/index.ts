import config from "./config/config";
import { app, setupServer } from "./utils/server";

(async () => {

    await setupServer();

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
})();