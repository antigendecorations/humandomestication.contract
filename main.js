function exportElementAsImage(element) {
	if (!element) {
		element = document.getElementById('save-image-target');
	}
	
	html2canvas(element, {
		width: element.offsetWidth,
		height: element.offsetHeight,
		scale: 1 // Ensures 1:1 pixel mapping without standard high-DPI scaling
	}).then(canvas => {
		const link = document.createElement('a');
		link.download = 'Domestication contract.png';
		link.href = canvas.toDataURL();
		link.click();
	});
}