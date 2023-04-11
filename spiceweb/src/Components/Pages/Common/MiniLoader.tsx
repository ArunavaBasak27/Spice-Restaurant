import React from "react";

const MiniLoader = ({ type = "warning", size = 100 }) => {
	return (
		<div
			className={`spinner-border text-${type}`}
			style={{ scale: `${size}%` }}
		>
			{" "}
		</div>
	);
};

export default MiniLoader;
