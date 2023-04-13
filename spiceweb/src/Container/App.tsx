import { Footer, Header } from "../Components/Layout";
import {
	CategoryList,
	CategoryUpsert,
	Home,
	NotFound,
	SubCategoryList,
	SubCategoryUpsert,
} from "../Pages";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<Header />
			<div className="p-5">
				<Routes>
					<Route path="/" element={<Home />} />

					<Route path="/categoryList" element={<CategoryList />} />
					<Route path="/createCategory" element={<CategoryUpsert />} />
					<Route path="/updateCategory/:id" element={<CategoryUpsert />} />

					<Route path="/subCategoryList" element={<SubCategoryList />} />
					<Route path="/createSubCategory" element={<SubCategoryUpsert />} />
					<Route
						path="/updateSubCategory/:id"
						element={<SubCategoryUpsert />}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			<Footer />
		</>
	);
}

export default App;
