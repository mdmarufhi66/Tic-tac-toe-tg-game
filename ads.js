// ads.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Get button elements ---
    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const watchStaticBtn = document.getElementById('watchStaticBtn');

    // --- Cooldown configuration ---
    const COOLDOWN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
    const COOLDOWN_STORAGE_KEY_VIDEO = 'monetag_video_cooldown'; // Local Storage Key
    const COOLDOWN_STORAGE_KEY_STATIC = 'monetag_static_cooldown'; // Local Storage Key

    // --- Cooldown state variables ---
    let lastVideoAdTime = parseInt(localStorage.getItem(COOLDOWN_STORAGE_KEY_VIDEO) || '0', 10);
    let lastStaticAdTime = parseInt(localStorage.getItem(COOLDOWN_STORAGE_KEY_STATIC) || '0', 10);

    let videoCooldownTimer = null; // To hold the interval for countdown display
    let staticCooldownTimer = null; // To hold the interval for countdown display

    // --- Helper function to check if cooldown is over ---
    function isCooldownOver(lastAdTime) {
        return (Date.now() - lastAdTime) >= COOLDOWN_DURATION;
    }

    // --- Function to start cooldown and update button state ---
    function startCooldown(adType) {
        const now = Date.now();
        let button, storageKey, timerVariable;

        if (adType === 'video') {
            lastVideoAdTime = now;
            button = watchVideoBtn;
            storageKey = COOLDOWN_STORAGE_KEY_VIDEO;
            timerVariable = 'videoCooldownTimer';
            // Clear any existing timer for video
            if (videoCooldownTimer) clearInterval(videoCooldownTimer);
        } else if (adType === 'static') {
            lastStaticAdTime = now;
            button = watchStaticBtn;
            storageKey = COOLDOWN_STORAGE_KEY_STATIC;
            timerVariable = 'staticCooldownTimer';
            // Clear any existing timer for static
            if (staticCooldownTimer) clearInterval(staticCooldownTimer);
        } else {
            console.error("Invalid ad type for cooldown:", adType);
            return;
        }

        // Save timestamp to Local Storage
        localStorage.setItem(storageKey, now.toString());

        // Disable button
        button.disabled = true;

        // Update button text with countdown
        function updateCountdown() {
            const elapsed = Date.now() - now;
            const remaining = Math.max(0, COOLDOWN_DURATION - elapsed); // Ensure it doesn't go below 0
            const secondsRemaining = Math.ceil(remaining / 1000);

            if (secondsRemaining <= 0) {
                button.innerText = adType === 'video' ? 'Watch Video Ads' : 'Watch Static Ads';
                button.disabled = false;
                // Clear the interval timer
                if (adType === 'video') clearInterval(videoCooldownTimer);
                else clearInterval(staticCooldownTimer);
            } else {
                const minutes = Math.floor(secondsRemaining / 60);
                const seconds = secondsRemaining % 60;
                button.innerText = `${adType === 'video' ? 'Video' : 'Static'} Ready in ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        // Start the countdown timer
        updateCountdown(); // Initial update immediately
        // Store the interval ID in the correct variable
        if (adType === 'video') {
            videoCooldownTimer = setInterval(updateCountdown, 1000);
        } else {
            staticCooldownTimer = setInterval(updateCountdown, 1000);
        }
    }


    // --- Function to initialize button states on load ---
    function initializeButtonStates() {
        // Check and apply cooldown for video ads
        if (!isCooldownOver(lastVideoAdTime)) {
            console.log("Video ad cooldown active. Resuming countdown.");
            startCooldown('video'); // Restart cooldown timer if still active
        } else {
            console.log("Video ad cooldown is over.");
            watchVideoBtn.disabled = false;
            watchVideoBtn.innerText = 'Watch Video Ads';
        }

        // Check and apply cooldown for static ads
        if (!isCooldownOver(lastStaticAdTime)) {
             console.log("Static ad cooldown active. Resuming countdown.");
            startCooldown('static'); // Restart cooldown timer if still active
        } else {
            console.log("Static ad cooldown is over.");
            watchStaticBtn.disabled = false;
            watchStaticBtn.innerText = 'Watch Static Ads';
        }
    }

    // --- Monetag Ad Loading and Showing (PLACEHOLDER FUNCTIONS) ---

    // !! IMPORTANT: YOU NEED TO REPLACE THE CONTENTS OF THESE FUNCTIONS
    // !! WITH YOUR ACTUAL MONETAG SDK INTEGRATION CODE.
    // !! Consult Monetag documentation for the exact methods to load and show
    // !! your specific ad formats (Rewarded, Interstitial, Popup, etc.) and
    // !! how to handle their lifecycle events (loaded, shown, completed/rewarded, closed, error).

    function loadAndShowVideoAd() {
        console.log("Attempting to load and show Video Ad (Monetag Placeholder)...");

        // --- START: REPLACE WITH YOUR ACTUAL MONETAG VIDEO AD CODE ---

        // Example structure (replace with actual Monetag SDK calls):
        if (typeof yourMonetagVideoAdObject !== 'undefined') { // Check if your Monetag ad object/SDK is available
            yourMonetagVideoAdObject.load({ /* parameters like zoneId */ })
                .then(() => { // Assuming a Promise-based load or success callback
                    console.log("Video Ad Loaded (Monetag Placeholder)");
                    yourMonetagVideoAdObject.show() // Assuming a show method
                        .then(() => { // Assuming a Promise-based show or completion callback
                             console.log("Video Ad Watched/Completed (Monetag Placeholder - Reward Event)");
                             // !! Call startCooldown ONLY when the ad is successfully watched/completed
                             startCooldown('video'); // Start cooldown after successful watch
                        })
                        .catch((error) => { // Assuming error handling for show
                            console.error("Video Ad Show Error (Monetag Placeholder):", error);
                            alert("Failed to show video ad. Please try again later.");
                            // Re-enable button if it was disabled before showing
                            watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
                            // You might NOT want to start cooldown on show error
                        });
                })
                .catch((error) => { // Assuming error handling for load
                    console.error("Video Ad Load Error (Monetag Placeholder):", error);
                    alert("Failed to load video ad. Please try again later.");
                     // Re-enable button
                    watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
                    // You might NOT want to start cooldown on load error
                });
        } else {
            console.error("Monetag Video Ad SDK object not found. Ensure SDK is loaded and initialized.");
            alert("Ad service not available. Please try again later.");
            watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime); // Re-enable button
        }

        // --- END: REPLACE WITH YOUR ACTUAL MONETAG VIDEO AD CODE ---
    }

     function loadAndShowStaticAd() {
        console.log("Attempting to load and show Static Ad (Monetag Placeholder)...");

        // --- START: REPLACE WITH YOUR ACTUAL MONETAG STATIC AD CODE ---

        // Example structure (replace with actual Monetag SDK calls):
         if (typeof yourMonetagStaticAdObject !== 'undefined') { // Check if your Monetag ad object/SDK is available
             yourMonetagStaticAdObject.load({ /* parameters like zoneId */ })
                 .then(() => { // Assuming a Promise-based load or success callback
                      console.log("Static Ad Loaded (Monetag Placeholder)");
                      yourMonetagStaticAdObject.show() // Assuming a show method
                           .then(() => { // Assuming a Promise-based show or completion callback
                                console.log("Static Ad Shown (Monetag Placeholder)");
                                // !! Call startCooldown after the static ad is shown/closed if that's your trigger
                                // !! For static ads, completion might just be showing it or closing it.
                                // !! Adjust based on Monetag's events and your desired trigger for cooldown.
                                startCooldown('static'); // Start cooldown after successful display/interaction
                           })
                           .catch((error) => { // Assuming error handling for show
                                console.error("Static Ad Show Error (Monetag Placeholder):", error);
                                alert("Failed to show static ad. Please try again later.");
                                // Re-enable button if it was disabled before showing
                                watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
                                // You might NOT want to start cooldown on show error
                           });
                 })
                  .catch((error) => { // Assuming error handling for load
                      console.error("Static Ad Load Error (Monetag Placeholder):", error);
                      alert("Failed to load static ad. Please try again later.");
                       // Re-enable button
                      watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
                      // You might NOT want to start cooldown on load error
                  });
         } else {
             console.error("Monetag Static Ad SDK object not found. Ensure SDK is loaded and initialized.");
             alert("Ad service not available. Please try again later.");
             watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime); // Re-enable button
         }

         // --- END: REPLACE WITH YOUR ACTUAL MONETAG STATIC AD CODE ---
    }

    // --- Button Click Handlers ---

    watchVideoBtn.addEventListener('click', () => {
        if (isCooldownOver(lastVideoAdTime)) {
            console.log("Video ad button clicked, cooldown over. Attempting to load ad.");
            // Temporarily disable button while ad is loading/showing
            watchVideoBtn.disabled = true;
            watchVideoBtn.innerText = 'Loading...';
            loadAndShowVideoAd();
        } else {
            // This case should ideally not happen if the button is disabled correctly
            console.log("Video ad button clicked, but still on cooldown.");
        }
    });

    watchStaticBtn.addEventListener('click', () => {
        if (isCooldownOver(lastStaticAdTime)) {
            console.log("Static ad button clicked, cooldown over. Attempting to load ad.");
             // Temporarily disable button while ad is loading/showing
            watchStaticBtn.disabled = true;
            watchStaticBtn.innerText = 'Loading...';
            loadAndShowStaticAd();
        } else {
             // This case should ideally not happen if the button is disabled correctly
            console.log("Static ad button clicked, but still on cooldown.");
        }
    });

    // --- Initialize on page load ---
    initializeButtonStates();

    // --- Telegram Web App Ready ---
    // Signals the Telegram client that the app is ready
    Telegram.WebApp.ready();
    console.log('Telegram Web App is ready.');

    // Optional: Expand the app to full height immediately
    // Telegram.WebApp.expand();

});
