
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
