import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;
beforeAll(async () => {
	jest.setTimeout(10000);
	process.env.JWT_KEY = "asdfasdf";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	jest.clearAllMocks();
	jest.setTimeout(35000);
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	jest.setTimeout(30000);
	await mongo.stop();
	await mongoose.connection.close();
});
