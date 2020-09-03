window.addEventListener("DOMContentLoaded", () => {
	//TODO-TOP

	//QUESTIONS PART====================================
	const start = document.querySelector(".start");
	const starter = document.querySelector(".starter");
	const next = document.querySelector(".next");
	const number = document.getElementById("number");
	const quizeBody = document.querySelector(".quize__details");
	const quizeQuestion = document.querySelector(".quize__question");
	const userAnswer = document.getElementById("userAns");
	const lessSpan = document.querySelector(".less");
	const total = document.querySelector(".total");
	const min = document.querySelector(".min");
	const sec = document.querySelector(".sec");

	const qBodyUrl = "./qBody.xml";
	const qQ = "./q.xml";
	const ansUrl = "./ans.xml";
	let qBodyData;
	let qData;
	let mainIndex = 0;
	let getUserAns = [];
	let skeppedIndex = 0;
	let skeppedAns = [];

	//sound
	let sound = document.getElementById("bell");
	//let sound = new Audio("../audio/bell.mp3");

	//times & left question
	let minutes = 50;
	let seconds = 60;
	let less = 0;

	//set total operator questions
	let totalQ = 5;
	total.innerHTML = totalQ;

	//clear LS
	if (localStorage.hasOwnProperty("setUserAns")) {
		localStorage.removeItem("setUserAns");
	}

	//EVENTS
	start.addEventListener("click", hideStartDiv);
	next.addEventListener("click", nextQuestion);

	//time count function
	min.innerHTML = (minutes < 10) ? "0" + minutes : minutes;
	sec.innerHTML = seconds;

	//toggle starter element hide/show
	function hideStartDiv() {
		starter.classList.toggle("hide");
		fetchData();
		setInterval(mySec, 1000); //1000=1 second
	}

	//FIXME-set seconds
	//set seconds
	function mySec() {
		seconds--;
		if (seconds < 1) {
			seconds = 60;
			minMin();
		}
		sec.innerHTML = (seconds < 10) ? "0" + seconds : seconds;
	}

	//FIXME-set minutes
	//set minutes
	function minMin() {
		minutes--;
		//sound.play();
		if (minutes < 1) {
			quizeOver("Time is Over!");
		}
		min.innerHTML = (minutes < 10) ? "0" + minutes : minutes;
	}

	//FIXME-FETCH DATA
	//fetch data
	async function fetchData() {
		//question body get
		const res = await fetch(qBodyUrl);
		const data = await res.text();
		const process = data.split("newPart");
		process.shift();
		qBodyData = process;

		//question get
		const res2 = await fetch(qQ);
		const data2 = await res2.text();
		const process2 = data2.split("newQ");
		process2.shift();
		qData = process2;

		//show init data to index.html
		showMe(mainIndex);
	}

	//FIXME-nextQuestion
	//each click on next button will be shown each question
	function nextQuestion() {
		//increse mainIndex on per click
		mainIndex += 1;

		//store answer
		let num = document.getElementById("number").innerHTML;
		let ans = userAnswer.value.trim();
		userAnswer.value = "";

		//get answer
		if (mainIndex <= qBodyData.length) {
			getUserAns.push(ans);
			localStorage.setItem('setUserAns', JSON.stringify(getUserAns));
		}

		//if question body is still available
		if (mainIndex <= qBodyData.length - 1) {
			showMe(mainIndex);
		} else {
			let ckValues = JSON.parse(localStorage.getItem("setUserAns"));
			let bool = function () {
				for (let i = 0; i < ckValues.length; i++) {
					if (ckValues[i] === "") return false;
				}
				return true;
			}
			if (bool()) {
				quizeOver("All Question is Finished!");
				return false;
			}
			skepQuestion(ans, num);
		}

	}

	//FIXME-skepQuestion
	//when user did not answer, then after finished the question call skepQuestion()
	function skepQuestion(ans, num) {
		//prev value empty
		skeppedAns = [];
		//ck is there any empty answer in LS
		let userAnswer = JSON.parse(localStorage.getItem("setUserAns"));
		userAnswer.forEach((answer, index) => {
			if (answer === "") {
				skeppedAns.push(index);
			}
		});

		//update LS if do values
		if (ans !== "" && num !== "") {
			skeppedAns.forEach(index => {
				if ((num - 1) === index) {
					//edit LS if answer put
					let lsValue = JSON.parse(localStorage.getItem("setUserAns"));
					lsValue[index] = ans;
					localStorage.setItem("setUserAns", JSON.stringify(lsValue));

					let ckValue = JSON.parse(localStorage.getItem("setUserAns"));

					let bool = function () {
						for (let i = 0; i < ckValue.length; i++) {
							if (ckValue[i] === "") return true;
						}
						return false;
					}
					if (!bool()) {
						quizeOver("All Questions is Finished!");
					}
				}
			})
		}
		//show skepped questions
		showMe((skeppedAns[skeppedIndex]) === undefined ? skeppedAns[0] : skeppedAns[skeppedIndex]);
		skeppedIndex++;
		if (skeppedIndex >= skeppedAns.length) {
			skeppedIndex = 0;
		}
	}

	//FIXME-quizeOver
	function quizeOver(msg) {
		console.log("QUIZE OVER!");
		answerProcess();
		/* 	over.classList.add("show");
			starter.style.display = "none !important";
			document.querySelector(".msg").innerHTML = msg; */
	}

	//FIXME-showMe
	//show value from xml to index.html
	function showMe(index) {
		//show number on index.html
		number.innerHTML = index + 1;

		if (qBodyData[index] === undefined) {
			return;
		}
		//show question body on index.html
		quizeBody.innerHTML = "";
		const textarea = document.createElement("textarea");
		textarea.innerHTML = qBodyData[index].trim()
		textarea.setAttribute("readonly", "");
		quizeBody.appendChild(textarea);
		textarea.style.padding = "2rem";
		textarea.style.fontSize = "2rem";
		textarea.style.height = textarea.scrollHeight + "px";

		//show question on index.html
		quizeQuestion.innerHTML = "";
		const p = document.createElement("p");
		p.innerHTML = qData[index].trim();
		quizeQuestion.appendChild(p);

		//increase 'less' question number
		if (localStorage.hasOwnProperty("setUserAns")) {
			let getLess = JSON.parse(localStorage.getItem("setUserAns"));
			less = 0;
			getLess.forEach(item => {
				if (item !== "") {
					less += 1;
					lessSpan.innerHTML = less;
				}
			});
		}
	}

	//ANSWER PART====================================

	//FIXME-answerProcess
	async function answerProcess() {
		//question body get
		const res3 = await fetch(qBodyUrl);
		const data3 = await res3.text();
		const process3 = data3.split("newPart");
		process3.shift();

		//question get
		const res4 = await fetch(qQ);
		const data4 = await res4.text();
		const process4 = data4.split("newQ");
		process4.shift();

		//get correct answer
		const ans = "../ans.xml";
		const res5 = await fetch(ans);
		const data5 = await res5.json();
		const process5 = data5.split("newAns");
		process5.shift();
		console.log(process5);

		//get user answer
		const userAnswer = JSON.parse(localStorage.getItem("setUserAns"));

		//send data to PHP file
		const check = {
			title: "check this data please!"
		};
		fetch("../mail.php", {
			method: "post",
			body: JSON.stringify(check),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (response) {
			return response.text();
		}).then(function (text) {
			console.log(text);
		}).catch(function (error) {
			console.log(error);
		})

		//Create answer template

	}


	//TODO-BOTTOM
});