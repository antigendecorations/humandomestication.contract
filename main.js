

import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas-pro@2.4.2/+esm';

async function exportElementAsImage(element) {
	return;
	
	if (!element) {
		element = document.getElementById('save-image-target');
	}
	
	console.log('exportElementAsImage', element);
	await document.fonts.ready; 
	
	html2canvas(element, {
		width: element.offsetWidth,
		height: element.offsetHeight,
		scale: 1, // Ensures 1:1 pixel mapping without standard high-DPI scaling
		scrollX: 0,
		scrollY: 0,
		useCORS: true,
		onclone: (clonedDocument) => {
			fixRepeatingLinearGradient(clonedDocument);
			fixInputTextClipping(clonedDocument);
			disbleLigatures(clonedDocument);
		}

	}).then(canvas => {
		const link = document.createElement('a');
		link.download = 'Domestication contract.png';
		link.href = canvas.toDataURL();
		link.click();
	});
}

function fixRepeatingLinearGradient(target_document) {
	// Query both cloned and original documents to safely get accurate dimensions and computed styles
	const original_document = document;
	const all_stripe_patterns_cloned = target_document.querySelectorAll('span.pattern-stripe > div');
	const all_stripe_patterns_original = original_document.querySelectorAll('span.pattern-stripe > div');
	
	all_stripe_patterns_cloned.forEach((pattern, index) => {
		const original_pattern = all_stripe_patterns_original[index];
		
		// Read the computed CSS variables for this specific input from the ORIGINAL element
		const styles = window.getComputedStyle(original_pattern);
		const width = parseFloat(styles.getPropertyValue('--stripe-width')) || 11.86;
		const angle = parseFloat(styles.getPropertyValue('--stripe-angle')) || 135.7;
		const shiftFactor = parseFloat(styles.getPropertyValue('--phase-shift-factor')) || 0.3;
		
		// Convert variables into SVG math
		const shift = width * shiftFactor;
		const rad = angle * (Math.PI / 180);
		const period = width * 2;
		
		const x2 = (Math.sin(rad) * period).toFixed(4);
		const y2 = (-Math.cos(rad) * period).toFixed(4);
		
		// Colors mapped to your variables
		const colorStripe = '%23fff5e9';    // var(--accent-paper)
		const colorAntiStripe = '%23f9e5dd'; // var(--accent-paper-parched)
		
		// Generate the SVG Data URI for the gradient
		const svgUri = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1500' height='1500'%3E%3Cdefs%3E%3ClinearGradient id='s' x1='0' y1='0' x2='${x2}' y2='${y2}' gradientUnits='userSpaceOnUse' spreadMethod='repeat' gradientTransform='translate(-${shift},-${shift})'%3E%3Cstop offset='0' stop-color='${colorAntiStripe}'/%3E%3Cstop offset='0.5' stop-color='${colorAntiStripe}'/%3E%3Cstop offset='0.5' stop-color='${colorStripe}'/%3E%3Cstop offset='1' stop-color='${colorStripe}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23s)'/%3E%3C/svg%3E`;

		// Apply it inline to override the CSS failure
		pattern.style.backgroundImage = `url("${svgUri}")`;
		pattern.style.backgroundPosition = '0 0'; // Reset since shift is in SVG

		// Bypass the html2canvas calc() parsing bug by calculating exact absolute pixels 
		// using the actual width and height of the original element.
		const w = original_pattern.offsetWidth;
		const h = original_pattern.offsetHeight;
		const cr = parseFloat(styles.getPropertyValue('--corner-radius')) || 11;
		
		// Build an exact polygon path without calc() or variable spaces
		const p1 = `${cr}px 0px`;
		const p2 = `${w - cr}px 0px`;
		const p3 = `${w}px ${cr}px`;
		const p4 = `${w}px ${h - cr}px`;
		const p5 = `${w - cr}px ${h}px`;
		const p6 = `${cr}px ${h}px`;
		const p7 = `0px ${h - cr}px`;
		const p8 = `0px ${cr}px`;
		
		// Override the CSS polygon inline on the clone
		pattern.style.clipPath = `polygon(${p1}, ${p2}, ${p3}, ${p4}, ${p5}, ${p6}, ${p7}, ${p8})`;
	});
}

function fixInputTextClipping(target_document) {
	// Find all target inputs in the cloned document
	const inputs = target_document.querySelectorAll('span.pattern-stripe > div > input');
	
	inputs.forEach(input => {
		// 1. Get the current text typed by the user
		const textValue = input.value;
		const parentDiv = input.parentElement;
		
		// 2. Remove the problematic <input> node
		input.remove();
		
		// 3. Place the text directly inside the parent <div>
		parentDiv.textContent = textValue;
		
		// 4. Mimic the <input>'s native horizontal and vertical centering
		parentDiv.style.display = 'inline-flex';
		parentDiv.style.alignItems = 'center';
		parentDiv.style.justifyContent = 'center';
	});
}

function disbleLigatures(target_document) {
	// .content-acknowledgment
	// .content-stipulation
	// ol.contract-clause-collection
	// font-feature-settings: "kern" 1, "liga" 1, "clig" 1, "calt" 1;
	
	const elementsToDisableLigatures = target_document.querySelectorAll('.content-acknowledgment, .content-stipulation, ol.contract-clause-collection');
	elementsToDisableLigatures.forEach(element => {
		element.style.fontFeatureSettings = '"kern" 1, "liga" 0, "clig" 0, "calt" 0';
	});
}

window.exportElementAsImage = exportElementAsImage;













// button pulse once on tap for non-hoverable devices

function addPulseAnimation() {
	const buttons = document.querySelectorAll('.navigation-menu button');
	buttons.forEach(button => {
		button.addEventListener('click', () => {
			button.classList.add('pulse-once-light');
			button.addEventListener('animationend', () => {
				button.classList.remove('pulse-once-light');
			}, { once: true });
		});
	});
}

addPulseAnimation();







