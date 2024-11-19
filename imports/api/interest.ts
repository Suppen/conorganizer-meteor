import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export type Interest = {
	userId: string;
	gameId: string;
	level: "low" | "medium" | "high";
};

export const InterestsCollection = new Mongo.Collection<Interest>("interests");

if (Meteor.isServer) {
	Meteor.publish("interests.forUser", function (userId: Interest["userId"]) {
		return InterestsCollection.find({ userId: userId });
	});

	Meteor.publish("interests.forUserForGame", function (userId: Interest["userId"], gameId: Interest["gameId"]) {
		return InterestsCollection.find({ userId, gameId });
	});

	Meteor.methods({
		"interests.set": async function (
			userId: Interest["userId"],
			gameId: Interest["gameId"],
			level: Interest["level"] | "none"
		) {
			if (level === "none") {
				await InterestsCollection.removeAsync({ userId, gameId });
			} else {
				await InterestsCollection.upsertAsync({ userId, gameId }, { $set: { level } });
			}
		}
	});
}
