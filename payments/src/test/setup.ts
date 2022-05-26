import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
	"sk_test_51L0XVDEEJz20M4jpMbZ8xED0olKmzP70yaAe8wBjHa0mg3pojPXQ1AQ5qp8iv58V8sAl86RCP3Hb8ppFSqpvHerq00nW6Ua0J3";

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
	jest.setTimeout(50000);
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	jest.setTimeout(50000);
	await mongo.stop();
	await mongoose.connection.close();
});
