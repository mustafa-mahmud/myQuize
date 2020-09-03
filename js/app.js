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
	const over = document.querySelector(".over");

	const qBodyUrl = "./qBody.xml";
	const qQ = "./q.xml";
	const ansUrl = "./ans.xml";
	let qBodyData;
	let qData;
	let mainIndex = 0;
	let getUserAns = [];
	let skeppedIndex = 0;
	let skeppedAns = [];
	const courseName = "PHP OPERATOR";
	let correctAns = 0;

	//sound
	let sound = document.getElementById("bell");
	//let sound = new Audio("../audio/bell.mp3");

	//times & left question
	let minutes = 50;
	let seconds = 60;
	let less = 0;

	//set total operator questions
	let totalQ = 10;
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
		sound.play();
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
		answerProcess();
		over.classList.add("show");
		starter.style.display = "none !important";
		document.querySelector(".msg").innerHTML = msg;
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
		//get q body
		const qBodyRes = await fetch(qBodyUrl);
		const qBodyData = await qBodyRes.text();
		const qBodyDataProcess = qBodyData.split("newPart");
		qBodyDataProcess.shift();

		//replace q body line break+space
		for (let i = 0; i < qBodyDataProcess.length; i++) {
			qBodyDataProcess[i] = qBodyDataProcess[i].replace(/\r\n/gm, "").trim();
		}

		//get q
		const qRes = await fetch(qQ);
		const qData = await qRes.text();
		const qDataProcess = qData.split("newQ");
		qDataProcess.shift();

		//replace q line break+space
		for (let i = 0; i < qDataProcess.length; i++) {
			qDataProcess[i] = qDataProcess[i].trim().replace(/\r\n/gm, "")
		}

		//get ans
		const ansRes = await fetch(ansUrl);
		const ansData = await ansRes.text();
		const ansDataProcess = ansData.split("newAns");
		ansDataProcess.shift();

		//replace ans line break+space
		for (let i = 0; i < ansDataProcess.length; i++) {
			ansDataProcess[i] = ansDataProcess[i].replace(/\r\n/gm, "").trim();
		}

		//get LS
		const parseUserAns = JSON.parse(localStorage.getItem("setUserAns"));

		//set json data for PHP
		const jsonData = [
			[qBodyDataProcess, qDataProcess, ansDataProcess, parseUserAns, courseName]
		];

		//get total correct ans
		for (let i = 0; i < jsonData[0][0].length; i++) {
			let okAns = jsonData[0][2][i];
			let userAns = jsonData[0][3][i];
			if (okAns == userAns) {
				correctAns++;
			}
		}

		//average/percentage of correct numbers
		let average = Math.round((correctAns / jsonData[0][0].length) * 100) + "%";

		//queston body html table for PHP
		let qBodyHtml = jsonData[0][0].map((item, index) => {
			return `
					<div class='wrapper' style='padding: 20px;'>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='center'
											style='color: #fff;font-size: 30px;display: inline-block;padding: 5px 10px;background-color: #0E6251;'>
											${index + 1}
											</td>
										<td width='30' align='center' height='30' colspan='1'></td>

										<td align='left'>
											<code style='font-size: 16px;'>
											${item}
										</code>
										</td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='30'></td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold; font-size: 20px;'>Question Was:</span>
											<span style='font-size: 18px;'>${jsonData[0][1][index]}</span>
										</td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='10'></td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold;font-size: 20px;'>Your Answer Was:</span>
											<span
											style = 'font-weight:bold ;font-size: 18px; ${(jsonData[0][2][index] != jsonData[0][3][index]) ? 'color: #FF0000 ' : 'color: #32CD32'}'>
											${jsonData[0][3][index]}
											</span>
										</td>
									</tr>
								</table>

								<table table border = '0'	cellpadding = '0'	cellspacing = '0'	width = '100%'
								style = '${(jsonData[0][2][index] != jsonData[0][3][index]) ? 'display:table' : 'display:none'}'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold;font-size: 20px;'>Correct Answer Was:</span>
											<span style='font-size: 18px; color:#32CD32;font-weight:bold'>${(jsonData[0][2][index]!=jsonData[0][3][index])?jsonData[0][2][index]:""}</span>
										</td>
									</tr> 
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='10' style='border-bottom: 1px dotted #666;'></td>
									</tr>
								</table>
					</div>
			`;
		});

		//calculate toal correct ans + average for PHP
		let result = `
								<div class='result'>
								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Question Was:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${jsonData[0][0].length}
											</span>
										</td>
									</tr>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Correct Was:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${correctAns}
											</span>
										</td>
									</tr>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Average Is:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${average}
											</span>
										</td>
									</tr>
								</table>
							</div>
		`;

		//output file it will send to PHP
		let output = `
			<table bgcolor='#666666' width='100%' align='center' border='0' cellspacing='0' cellpadding='0'
		style='padding: 30px 0px;'>
		<tr>
			<td align='center'>
				<table bgcolor='#F6F6F6' align='center' border='0' cellpadding='0' cellspacing='0'>
					<tr>
						<td width='600' align='center' style='padding: 20px 10px;'>
							<table border='0' cellpadding='0' cellspacing='0' style='display: inline-block;'>
								<tr>
									<td width='600' align='center'
										style='font-size: 30px;font-style: italic;font-weight: bold;border-bottom: 2px solid #222;'>
										${jsonData[0][4]}
									</td>
								</tr>
								<tr>
									<td width='600' align='center' height='30' colspan='1'></td>
								</tr>
							</table>
							${qBodyHtml}

							${result}
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
		`;

		//at last send data to PHP
		await fetch("./mail.php", {
			method: "post",
			body: output,
			headers: {
				"Content-Type": "application/text"
			}
		});
	}

	//TODO-BOTTOM
});