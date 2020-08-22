window.addEventListener("DOMContentLoaded", () => {
	/* ======================== */

	const start = document.querySelector(".start");
	const starter = document.querySelector(".starter");
	const clickMe = document.querySelector(".clickMe");

	//events
	start.addEventListener("click", showQ);

	//start hide
	function showQ(e) {
		e.target.parentElement.classList.add("hide");
	}

	//starter display:none
	starter.addEventListener("transitionend", function () {
		this.style.display = "none";
	});


	/* ======================== */
});