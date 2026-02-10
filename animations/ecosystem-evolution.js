
/**
 * Animations for the Ecosystem Evolution phase (2:10 - 2:20)
 * Transforming from foundation-funded to self-sustaining model.
 */

// Helper to create satellite schools
function createSatelliteSchools(mainSchoolNodeId, count) {
    const mainSchool = document.getElementById(mainSchoolNodeId);
    if (!mainSchool) {
        console.error(`Main school node ${mainSchoolNodeId} not found`);
        return [];
    }

    // Get SVG coordinate context
    const svg = document.querySelector('svg');
    const satellites = [];

    // Positions relative to main school center (280, 880)
    // User specs: Offset (-60, -40), (-50, +50), (+40, +60), (+50, -30)
    const offsets = [
        { x: -60, y: -40 },
        { x: -50, y: 50 },
        { x: 40, y: 60 },
        { x: 50, y: -30 }
    ];

    // Original size reference (approx 280x280 based on image in index.html)
    // User wants 30% size
    const size = 280 * 0.3;

    // Center of main school
    const centerX = 280;
    const centerY = 880;

    // Icons used in phase 2 nodes were simple paths or images. 
    // We can reuse the image from main school but smaller.
    const href = mainSchool.querySelector('image').getAttribute('href');

    for (let i = 0; i < count; i++) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "satellite-school");

        const x = centerX + offsets[i].x - (size / 2);
        const y = centerY + offsets[i].y - (size / 2);

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", href);
        image.setAttribute("x", x);
        image.setAttribute("y", y);
        image.setAttribute("width", size);
        image.setAttribute("height", size);

        group.appendChild(image);

        // Append to the same parent as main school (ecosystem-nodes)
        // to ensure z-index/layering is similar
        mainSchool.parentElement.appendChild(group);

        // Initial state: hidden
        group.style.opacity = 0;

        satellites.push(group);
    }

    return satellites;
}

// Helper to create "Self-Funded" badge
function createSelfFundedBadge() {
    // Center of Schools -> Center line. 
    // Path is #path-in-schools (from Schools (280,880) to Center area)
    // Wait, in index.html, #path-in-schools d="M 280 880 Q 200 540, 900 600"
    // Is this the one? "Schools -> Center line"
    // The user says "Schools -> Center line (original color, 2px) -> Green, 5px"
    // In index.html line 2084: createFlow(t, "path-in-schools", "fa-users", "#58D4DE", "Students & Data")
    // So "path-in-schools" is the one.

    // Calculate midpoint.
    const path = document.getElementById("path-in-schools");
    if (!path) return null;

    const len = path.getTotalLength();
    const point = path.getPointAtLength(len / 2); // Roughly midpoint

    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", point.x - 40); // Center 80px width
    foreignObject.setAttribute("y", point.y - 40); // Center 80px height
    foreignObject.setAttribute("width", 80);
    foreignObject.setAttribute("height", 80);
    foreignObject.setAttribute("class", "self-funded-badge-container");

    const div = document.createElement("div");
    div.className = "self-funded-badge";
    div.style.cssText = `
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #2ECC71;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    opacity: 1; /* handled by GSAP */
  `;

    div.innerHTML = `
    <span class="self-funded-badge-icon" style="font-size: 16px; margin-right: 4px; color: white;">♻️</span>
    <span class="self-funded-badge-text" style="color: white; font-size: 12px; font-weight: 500;">Self-Funded</span>
  `;

    foreignObject.appendChild(div);

    // Append to overlays or similar top-level group
    document.getElementById("overlays").appendChild(foreignObject);

    // Initial state handled by animation
    foreignObject.style.opacity = 0;

    return foreignObject;
}

/**
 * Main animation function to be called from the main timeline
 * @param {GSAPTimeline} mainTl - The main timeline instance
 * @param {number} startTime - The absolute start time on the timeline (equivalent to 2:10 VIDEO time)
 */
function animateEcosystemEvolution(mainTl, startTime) {

    // ----------------------------------------------------------------
    // PHASE 1: Foundation Step-Back (2:10-2:13, 3s)
    // ----------------------------------------------------------------

    // 1. Dim Foundations Node
    mainTl.to('#node-foundations', {
        opacity: 0.4,
        duration: 2.0,
        ease: 'power2.out'
    }, startTime); // 2:10

    // 2. Modify Foundation -> Center Line
    // Line ID: #path-in-foundations (as per createFlow usage for funding)
    const foundationLine = '#path-in-foundations';
    mainTl.to(foundationLine, {
        strokeDasharray: "8, 4",
        opacity: 0.6,
        duration: 2.0,
        ease: 'power2.out'
    }, startTime); // 2:10

    // 3. Fade "Funding" badge
    // Badge ID: #flow-path-in-foundations-text (and icon?)
    // User only mentioned "Funding badge", maybe implied text + icon.
    // The ID generated in index.html is `flow-${pathId}-text` and `flow-${pathId}-icon`
    mainTl.to(['#flow-path-in-foundations-text', '#flow-path-in-foundations-icon'], {
        opacity: 0.6,
        duration: 2.0,
        ease: 'power2.out'
    }, startTime); // 2:10


    // ----------------------------------------------------------------
    // PHASE 2: System Acceleration (2:13-2:16, 3s)
    // ----------------------------------------------------------------
    const phase2Start = startTime + 3.0; // 2:13

    // Lines to pulse (everything except Foundation->Center)
    const exchangeLines = [
        '#path-in-tutors',      // Tutors -> Center (Teaching)
        '#path-out-schools',    // Center -> Schools (Free Teaching)
        '#path-in-schools',     // Schools -> Center (Students & Data)
        '#path-out-researchers',// Center -> Researchers (Insights)
        '#path-in-researchers'  // Researchers -> Center (Findings) ? Wait, Researchers -> Foundations?
        // User list:
        // Line 1 (Tutors -> Center)
        // Line 2 (Center -> Schools)
        // Line 3 (Schools -> Center)
        // Line 4 (Center -> Researchers)
        // Line 5 (Researchers -> Foundations) -> Wait, line 2096 is path-out-foundations used for "Foundations see validated impact"
        // So distinct lines.
    ];

    // Define the pulse function (using separate glow element or stroke-dash offset)
    // User recommended Pulse Properties: Gradient stroke-dashoffset or similar.
    // Since lines are simple paths, we can clone them or just animate a "pulse" class.
    // Given current implementation uses stroke-dasharray for dashed lines, adding a pulse might conflict if we change stroke options.
    // BUT the lines in this phase are SOLID (dasharray: none).

    // Let's create a definition for the gradient if not exists
    // We can do this via JS or it might be in HTML. 
    // User said: "Create a gradient definition in your SVG <defs>"
    // We'll assume we can add it or it exists. Let's add it dynamically to be safe.
    const defs = document.querySelector('defs');
    if (defs && !document.getElementById('pulse-gradient')) {
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        grad.id = "pulse-gradient";
        grad.innerHTML = `
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    `; // Using White/CurrentColor for generic pulse
        defs.appendChild(grad);
    }

    // Actually, we want to pulse "transparent -> line-color -> transparent".
    // Doing this on the stroke itself is tricky if we want to keep the underlying line visible.
    // Better to use a CLONE line on top defined as the pulse.

    const linesToPulse = [
        { id: 'path-in-tutors', start: 0.0 },
        { id: 'path-out-schools', start: 0.3 },
        { id: 'path-in-schools', start: 0.6 },
        { id: 'path-out-researchers', start: 0.9 },
        { id: 'path-out-foundations', start: 1.2 } // Researchers -> Foundations (mapped to path-out-foundations)
    ];

    linesToPulse.forEach(item => {
        const original = document.getElementById(item.id);
        if (!original) return;

        // Create pulse clone
        const pulseLine = original.cloneNode(true);
        pulseLine.id = `pulse-${item.id}`;
        pulseLine.setAttribute('stroke', 'url(#pulse-gradient)'); // Or handle color specific
        // Wait, gradient needs to match line color? 
        // User said: "Gradient (transparent -> line-color -> transparent)"
        // If we use white with overlay blend mode or just brightness, it might work.
        // Or we stick to a simple generic pulse.
        // Let's use a white pulse for visibility on top of colored lines.
        pulseLine.setAttribute('stroke', 'white');
        pulseLine.setAttribute('stroke-width', '4'); // Slightly thicker
        pulseLine.setAttribute('opacity', '0.8');
        pulseLine.style.pointerEvents = 'none';

        // Insert after original
        original.parentNode.insertBefore(pulseLine, original.nextSibling);

        const len = original.getTotalLength();

        // Animate stroke-dashoffset to simulate travel
        // We set dasharray to [length/4, length] so it's a segment
        mainTl.set(pulseLine, {
            strokeDasharray: `${40} ${len}`, // 40px visible
            strokeDashoffset: 40, // Start slightly before
            opacity: 0.8
        }, phase2Start + item.start);

        mainTl.fromTo(pulseLine,
            { strokeDashoffset: len + 40 },
            {
                strokeDashoffset: -40,
                duration: 0.8,
                ease: 'sine.inOut',
                repeat: 2, // 3 times total
                repeatDelay: 0.2 // A bit of delay between pulses
            },
            phase2Start + item.start
        );

        // Cleanup pulse line after animation
        mainTl.to(pulseLine, { opacity: 0, duration: 0.1 }, phase2Start + item.start + (0.8 * 3) + 0.5);
    });

    // Thicken lines (2px -> 3px)
    // EXCEPT Foundation -> Center (#path-in-foundations)
    const thickenSelector = linesToPulse.map(l => '#' + l.id).join(', ');
    mainTl.to(thickenSelector, {
        strokeWidth: 3,
        duration: 2.0,
        ease: 'power2.inOut'
    }, phase2Start + 1.0); // 2:14 start


    // ----------------------------------------------------------------
    // PHASE 3: Self-Funding Emergence (2:16-2:18, 2s)
    // ----------------------------------------------------------------
    const phase3Start = startTime + 6.0; // 2:16

    // 1. Shrink Schools Node
    mainTl.to('#node-schools', {
        scale: 0.7,
        transformOrigin: 'center center',
        duration: 1.0,
        ease: 'power2.inOut'
    }, phase3Start);

    // 2. Add Satellites
    const satellites = createSatelliteSchools('node-schools', 4); // Create elements
    // Animate them in
    if (satellites.length > 0) {
        mainTl.to(satellites, {
            opacity: 1,
            duration: 1.0,
            ease: 'power2.out',
            stagger: 0 // Simultaneous or slight stagger? User says "Start: 2:16.5... Duration: 1s"
        }, phase3Start + 0.5);
    }

    // 3. "Funding" badge fade out (Foundation->Center)
    mainTl.to(['#flow-path-in-foundations-text', '#flow-path-in-foundations-icon'], {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, phase3Start);

    // 4. "Self-Funded" badge creation
    const selfFundedBadge = createSelfFundedBadge();
    if (selfFundedBadge) {
        mainTl.to(selfFundedBadge, {
            opacity: 1.0,
            duration: 0.8,
            ease: 'power2.in'
        }, phase3Start + 0.8); // 2:16.8
    }

    // 5. Schools -> Center line color change
    // Line: #path-in-schools
    mainTl.to('#path-in-schools', {
        stroke: '#2ECC71',
        duration: 0.8,
        ease: 'none'
    }, phase3Start + 0.8); // 2:16.8


    // ----------------------------------------------------------------
    // PHASE 4: System Maturity (2:18-2:20, 2s)
    // ----------------------------------------------------------------
    const phase4Start = startTime + 8.0; // 2:18

    // 1. Thicken Lines to 5px
    // Schools -> Center (#path-in-schools)
    // Schools -> Researchers (Wait, is there a direct line? Or Center -> Researchers?)
    // User says "Schools -> Researchers line". In current diagram, visual flow is Center -> Researchers.
    // But maybe there is a direct line?
    // index.html: "Schools share students and data" -> #path-in-schools (Schools -> Center).
    // "Researchers access insights" -> #path-out-researchers (Center -> Researchers).
    // "Researchers publish findings" -> #path-in-researchers (Researchers -> Center/Foundations?).

    // Visual check of standard ecosystem diagram: Typically a central hub.
    // User says "Schools -> Researchers line".
    // Maybe "path-in-schools" AND "path-out-researchers" form the path?
    // Let's thicken both if ambiguous, OR just "path-out-researchers" if that's the "link" to researchers.
    // BUT user explicitly listed "Schools -> Researchers line" as a DISTINCT entity in the summary table.
    // AND "Schools -> Center line".
    // If there is NO direct line in DOM, I should probably thicken the path from Center to Researchers (#path-out-researchers) to represent that flow.

    mainTl.to('#path-in-schools', {
        strokeWidth: 5,
        duration: 1.5,
        ease: 'power2.out'
    }, phase4Start);

    mainTl.to('#path-out-researchers', { // Best guess for "Schools -> Researchers" flow
        strokeWidth: 5,
        duration: 1.5,
        ease: 'power2.out'
    }, phase4Start);

    // 2. Final System Pulse (All nodes)
    const allNodes = ['#node-foundations', '#node-tutors', '#node-schools', '#node-researchers', '#central-node'];

    mainTl.to(allNodes, {
        scale: 1.05,
        duration: 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
    }, phase4Start + 1.2); // 2:19.2 start

    // 3. Brightness pulse on lines
    const activeLines = [
        '#path-in-schools', '#path-in-tutors', '#path-out-schools', '#path-out-researchers', '#path-out-tutors'
        // Exclude foundation-center (#path-in-foundations, #path-out-foundations)
    ];

    // GSAP filter animation might need plugin or specific attr
    // brightness hack: toggle stroke color or opacity?
    // Or CSS filter. SVG elements support filter="brightness(1.1)".
    // Let's try CSS filter.
    // Note: CSS brightness on stroke might behave effectively.
    // Actually, animating 'filter' property works in GSAP.

    mainTl.to(activeLines, {
        filter: 'brightness(1.3)', // Go a bit higher to be visible
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut'
    }, phase4Start + 1.2);

    return mainTl;
}

// Attach to window for easy access in index.html
window.animateEcosystemEvolution = animateEcosystemEvolution;
