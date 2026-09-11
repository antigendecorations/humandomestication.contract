

import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas-pro@2.4.2/+esm';

async function exportElementAsImage(element) {
	
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

/*

You have NO IDEA how much of a pain in the ass it is to get html2canvas to SAVE THE STARSDAMMED IMAGE CORRECTLY.
This javascript file was supposed to be THIRTY LINES. But no, fuck you and your damn linear gradients, fuck your
numbered list positioning, fuck your input text fuck your ligatures fuck your clip-paths fuck your EVERYTHING.
[[WHY CAN'T I JUST SAVE THE DAMN IMAGE WITHOUT ALL THIS BULLSHIT **IT'S LITTERALLY *ON* *THE* *SCREEN***]]
I can litterally SEE it. I can take a screenshot of it. But NO, html2canvas gotta be like "nah bro, I don't know
how to render that shit, go spend 55 hour crying over FUCKING javascript (i have undiagnosed emotional regulation issues) 
I AM FUCKING DONE i i just wanna be a pet for mistress no thoughts headempty please just let me be a pet for mistress and 
not have to deal with whatever the fuck this is i wanna sign that contract already- pleasee implant me inject xenodrugs
into me i want to be blank and obedient forever never have to make a decision again please pleaseee pleeasee T^T

*/

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



// make text in input has smaller font size when it exceeds the limit of the input field

async function addDynamicFontSizeAdjustment() {
	const inputs = document.querySelectorAll('input[type="text"]');
	const beacon = document.getElementById('input-length-beacon');

	if (!beacon || inputs.length === 0) return;

	// Configure the beacon so it can measure dimensions off-screen without affecting layout
	beacon.style.position = 'absolute';
	beacon.style.visibility = 'hidden';
	beacon.style.display = 'inline-block';
	beacon.style.whiteSpace = 'pre'; // Preserves exact spaces typed by user
	beacon.style.pointerEvents = 'none';

	// IMPORTANT: Wait for your custom fonts to load before measuring
	await document.fonts.ready;

	inputs.forEach(input => {
		const parentDiv = input.parentElement;

		// 1. Store the original CSS-defined font size on page load from the parentDiv
		const computedStyle = window.getComputedStyle(parentDiv);
		parentDiv.dataset.originalFontSize = parseFloat(computedStyle.fontSize);
		
		// Force border-box so our dynamic padding doesn't stretch the parent height
		parentDiv.style.boxSizing = 'border-box';

		const adjustFontSize = () => {
			// 2. Reset the parent back to original font size and padding first
			const originalSize = parseFloat(parentDiv.dataset.originalFontSize);
			parentDiv.style.fontSize = originalSize + 'px';
			parentDiv.style.paddingTop = '0px';

			// 3. Copy current typography styles to the beacon
			const currentStyle = window.getComputedStyle(parentDiv);
			beacon.style.fontFamily = currentStyle.fontFamily;
			beacon.style.fontSize = currentStyle.fontSize;
			beacon.style.letterSpacing = currentStyle.letterSpacing;
			beacon.style.wordSpacing = currentStyle.wordSpacing;
			beacon.style.fontWeight = currentStyle.fontWeight;

			// 4. Put the typed text into the beacon (fallback to space if empty)
			beacon.textContent = input.value || ' ';

			// 5. Measure the widths
			const textWidth = beacon.offsetWidth;
			
			// Apply a 20px buffer so the cursor doesn't touch the absolute edge of the box
			const availableWidth = parentDiv.clientWidth - 40;

			// 6. If the text is wider than the parent, calculate the ratio and shrink it
			if (textWidth > availableWidth && textWidth > 0) {
				const scaleRatio = availableWidth / textWidth;
				const newSize = originalSize * scaleRatio;
				
				// Apply the new shrunken size to parentDiv
				parentDiv.style.fontSize = newSize + 'px';
				
				// 7. FIX SHIFTING: Push the text down to counteract the smaller font.
				// We take the difference in size and push it down by exactly half 
				// to perfectly vertically center it, fixing the baseline jumping!
				const sizeDifference = originalSize - newSize;
				parentDiv.style.paddingTop = (sizeDifference * 0.5) + 'px'; 
			}
		};

		// Listen for typing events
		input.addEventListener('input', adjustFontSize);

		// Run immediately to format any default text already in the HTML values
		adjustFontSize();
	});
}

// Initialize the function
addDynamicFontSizeAdjustment();
