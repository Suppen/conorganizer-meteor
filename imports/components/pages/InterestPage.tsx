import React from "react";
import { Meteor } from "meteor/meteor";
import { generatePath, Link, useParams } from "react-router-dom";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { Interest, InterestsCollection } from "/imports/api/interest";

export const InterestPage = () => {
	const { userId, gameId } = useParams<"userId" | "gameId">();
	if (userId === undefined || gameId === undefined) {
		throw new Error("Missing userId or gameId. A developer fucked up. These must be provided through the URL.");
	}

	useSubscribe("interests.forUserForGame", userId, gameId);
	const [interest] = useFind(() => InterestsCollection.find({ userId, gameId }));

	useSubscribe("interests.forUser", userId);
	const interests = useFind(() => InterestsCollection.find({ userId }));

	const GameLink = ({ gameId }: { gameId: Interest["gameId"] }) => (
		<Link to={generatePath("/:userId/:gameId", { userId, gameId })}>{gameId}</Link>
	);

	return (
		<article>
			<section>
				<h2>Interest for this game</h2>
				<dl>
					<div>
						<dt>User</dt>
						<dd>{userId}</dd>
					</div>
					<div>
						<dt>Game</dt>
						<dd>{gameId}</dd>
					</div>
					<div>
						<dt>Interest</dt>
						<dd>
							<button
								type="button"
								style={{ backgroundColor: interest === undefined ? "cyan" : "lightgrey" }}
								onClick={() => Meteor.callAsync("interests.set", userId, gameId, "none")}
							>
								None
							</button>
							<button
								type="button"
								style={{ backgroundColor: interest?.level === "low" ? "cyan" : "lightgrey" }}
								onClick={() => Meteor.callAsync("interests.set", userId, gameId, "low")}
							>
								Low
							</button>
							<button
								type="button"
								style={{ backgroundColor: interest?.level === "medium" ? "cyan" : "lightgrey" }}
								onClick={() => Meteor.callAsync("interests.set", userId, gameId, "medium")}
							>
								Medium
							</button>
							<button
								type="button"
								style={{ backgroundColor: interest?.level === "high" ? "cyan" : "lightgrey" }}
								onClick={() => Meteor.callAsync("interests.set", userId, gameId, "high")}
							>
								High
							</button>
						</dd>
					</div>
				</dl>
			</section>
			<section>
				<h2>All interests</h2>
				{interests.some(i => i.level === "high") ? (
					<section>
						<h3>High</h3>
						<ul>
							{interests
								.filter(i => i.level === "high")
								.map(i => (
									<li key={i.gameId}>
										<GameLink gameId={i.gameId} />
									</li>
								))}
						</ul>
					</section>
				) : null}
				{interests.some(i => i.level === "medium") ? (
					<section>
						<h3>Medium</h3>
						<ul>
							{interests
								.filter(i => i.level === "medium")
								.map(i => (
									<li key={i.gameId}>
										<GameLink gameId={i.gameId} />
									</li>
								))}
						</ul>
					</section>
				) : null}
				{interests.some(i => i.level === "low") ? (
					<section>
						<h3>Low</h3>
						<ul>
							{interests
								.filter(i => i.level === "low")
								.map(i => (
									<li key={i.gameId}>
										<GameLink gameId={i.gameId} />
									</li>
								))}
						</ul>
					</section>
				) : null}
			</section>
		</article>
	);
};

export default InterestPage;
