import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`Backend berjalan di http://localhost:${config.port}`);
});
