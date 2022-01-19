import "reflect-metadata";

import cors from "cors";
import express, { Application } from "express";
import ensureUserIsAuthenticated from "./middlewares/ensureUserIsAuthenticated";

class App {
  public readonly express: Application;

  constructor() {
    this.express = express();

    this.middlewares();
  }

  private middlewares = (): void => {
    this.express.disable("x-powered-by");
    // this.express.use(express.json());
    this.express.use(cors({ origin: "*" }));
  };
}

export default App;