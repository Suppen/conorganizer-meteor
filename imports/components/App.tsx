import React from "react";
import { createBrowserRouter, generatePath, Navigate, RouterProvider } from "react-router-dom";
import InterestPage from "./pages/InterestPage";

export const App = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <Navigate to={generatePath("/:userId/:gameId", { userId: "1", gameId: "1" })} />
			},
			{
				path: "/:userId/:gameId",
				element: <InterestPage />
			}
		])}
	/>
);
