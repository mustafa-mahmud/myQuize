window.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	const sizeDiv = document.createElement('div');
	const rgba = 'rgba(0,0,0,0.3)'.replace(/[^,]+(?=\))/, '0.5');
	sizeDiv.id = 'browserSize';
	sizeDiv.style.position = 'fixed';
	sizeDiv.style.minWidth = '100px';
	sizeDiv.style.minheight = '50px';
	sizeDiv.style.bottom = '10px';
	sizeDiv.style.left = '10px';
	sizeDiv.style.padding = '10px';
	sizeDiv.style.fontSize = '14px';
	sizeDiv.style.color = '#fff';
	sizeDiv.style.letterSpacing = '1.5px';
	sizeDiv.style.backgroundColor = `${rgba}`;
	sizeDiv.style.boxShadow = `-5px 3px 20px ${rgba}`;
	sizeDiv.style.zIndex = '9999999999999';
	sizeDiv.style.margin = '0px';
	sizeDiv.style.border = '1px solid #ffffff';
	sizeDiv.style.fontFamily = 'Arial, Helvetica, sans-serif';
	sizeDiv.style.borderRadius = '2px';

	sizeDiv.innerHTML = `
		<p class='scriptWidth'>Width: ?</p>
		<p class='scriptHeight'>Height: ?</p>
	`;

	body.appendChild(sizeDiv);
	document.querySelector('.scriptWidth').style.margin = '0px';
	document.querySelector('.scriptWidth').style.lineHeight = '1';
	document.querySelector('.scriptHeight').style.margin = '0px';
	document.querySelector('.scriptHeight').style.lineHeight = '1';

	const widthBody = document.querySelector('.scriptWidth');
	const heightBody = document.querySelector('.scriptHeight');

	widthBody.innerHTML = `Width: ${window.innerWidth}`;
	heightBody.innerHTML = `Height: ${window.innerHeight}`;

	window.addEventListener('resize', () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		widthBody.innerHTML = `Width: ${width}`;
		heightBody.innerHTML = `Height: ${height}`;
	})
});