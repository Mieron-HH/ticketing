// Importing packages
import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Importing Routes
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRotuer } from "./routes";
import { updateTicketRotuer } from "./routes/update";

// Importing Middlewares and Error Generators
import { errorHandler, NotFoundError, currentUser } from "@mhhtickets/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRotuer);
app.use(updateTicketRotuer);

app.all("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
