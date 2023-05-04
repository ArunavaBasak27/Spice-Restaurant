import { useDispatch } from "react-redux";
import { AllMenuItems, CouponCarousel } from "../Components/Pages/Home";
import { useEffect, useState } from "react";
import { useGetMenuItemsQuery } from "../Apis/menuItemApi";
import { setMenuItem } from "../Storage/Redux/menuItemSlice";
import { menuItemModel } from "../Interfaces";
import { MainLoader } from "../Components/Pages/Common";

const Home = () => {
	const dispatch = useDispatch();
	const { data, isLoading } = useGetMenuItemsQuery(null);
	const [categoryList, setCategoryList] = useState<string[]>([""]);
	const [selectedCategory, setSelectdCategory] = useState("Show All");
	useEffect(() => {
		if (!isLoading) {
			dispatch(setMenuItem(data.result));
		}
	}, [isLoading]);

	useEffect(() => {
		if (data && data?.result) {
			const tempCategoryList = [""];
			data?.result?.forEach((item: menuItemModel) => {
				if (tempCategoryList.indexOf(item.category?.name!) === -1) {
					tempCategoryList.push(item.category?.name!);
				}
			});
			setCategoryList(tempCategoryList);
		}
	}, [data]);

	const handleCategoryClick = (i: number) => {
		const buttons = document.querySelectorAll(".filter");
		console.log(buttons);
		let localCategory = "";
		buttons.forEach((button, index) => {
			if (index === i) {
				button.classList.add("active", "btn", "btn-secondary");
				if (index === 0) {
					localCategory = "Show All";
				} else {
					localCategory = categoryList[index];
				}
				setSelectdCategory(localCategory);
			} else {
				button.classList.remove("active", "btn", "btn-secondary");
			}
		});
	};

	return (
		<div className="container">
			<CouponCarousel />
			<br />
			<br />

			<div className="backgroundWhite container">
				<div className="row">
					<div className="col-12">
						<ul className="menu-filter-list list-inline text-center">
							{categoryList &&
								categoryList.map((categoryName: string, index: number) => {
									if (index > 0) {
										return (
											<li
												onClick={() => handleCategoryClick(index)}
												className="filter m-2"
												key={index}
											>
												{categoryName}
											</li>
										);
									} else {
										return (
											<li
												key={index}
												onClick={() => handleCategoryClick(index)}
												className="filter active btn btn-secondary m-2"
											>
												Show All
											</li>
										);
									}
								})}
						</ul>
					</div>
					{isLoading && <MainLoader />}
					{!isLoading &&
						(selectedCategory === "Show All"
							? categoryList.sort()
							: [selectedCategory]
						).map((category, index: number) => {
							let menuItemList = data?.result?.filter(
								(menuItem: menuItemModel) =>
									menuItem.category?.name === category
							);
							return <AllMenuItems key={index} menuItemList={menuItemList} />;
						})}
				</div>
			</div>
		</div>
	);
};

export default Home;
