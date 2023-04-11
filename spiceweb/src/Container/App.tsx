import { useEffect, useState } from "react";
import { Footer, Header } from "../Components/Layout";
import { Home, NotFound } from "../Pages";
import { Route, Routes } from "react-router-dom";

function App() {
	const [category, setCategory] = useState([]);
	useEffect(() => {
		fetch("https://localhost:7165/api/Category")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
			});
	}, []);

	return (
		<>
			<Header />
			<div className="pb-5">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			<Footer />
		</>
	);
}

export default App;
