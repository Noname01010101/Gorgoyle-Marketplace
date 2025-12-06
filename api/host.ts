import serverController from "./src/server/serverController";

const port = process.env.PORT || 3000;
serverController.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
