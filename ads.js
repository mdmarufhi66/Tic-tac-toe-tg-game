// ads.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Get button elements ---
    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const watchStaticBtn = document.getElementById('watchStaticBtn');

    // --- Cooldown configuration ---
    const COOLDOWN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
    const COOLDOWN_STORAGE_KEY_VIDEO = 'whephiwums_video_cooldown'; // Local Storage Key
    const COOLDOWN_STORAGE_KEY_STATIC = 'whephiwums_static_cooldown'; // Local Storage Key

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

    // --- Whephiwums.com Ad Loading and Showing ---

    // This assumes the whephiwums.com SDK provides a global function called 'show_9237531'
    // as indicated in the script tag data attribute and the snippet you provided.

    function loadAndShowVideoAd() {
        console.log("Attempting to load and show Video (Rewarded Interstitial) Ad...");

        // Check if the SDK function is available
        if (typeof show_9237531 === 'function') {
            // Call the SDK function for Rewarded Interstitial
            // The .then() block executes when the ad is successfully watched/completed.
            // The .catch() block handles errors during ad display.
            show_9237531()
                .then(() => {
                    console.log("Video Ad (Rewarded Interstitial) Watched/Completed.");
                    // Start cooldown after the ad is successfully completed and rewarded.
                    startCooldown('video');
                })
                .catch(e => {
                    console.error("Video Ad (Rewarded Interstitial) Error:", e);
                    alert("Failed to show video ad. Please try again later.");
                    // Re-enable button if it was disabled before showing due to error
                    watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
                    // Do NOT start cooldown on error, as the user didn't see the ad.
                });
        } else {
            console.error("Whephiwums.com SDK function 'show_9237531' not found. Ensure SDK is loaded.");
            alert("Ad service not available. Please try again later.");
            // Re-enable button if SDK is not available
            watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
        }
    }

     function loadAndShowStaticAd() {
        console.log("Attempting to load and show Static (Rewarded Popup) Ad...");

         // Check if the SDK function is available
        if (typeof show_9237531 === 'function') {
             // Call the SDK function for Rewarded Popup ('pop')
             // The .then() block executes when the ad is successfully shown/closed.
             // The .catch() block handles errors during ad display.
             show_9237531('pop')
                .then(() => {
                     console.log("Static Ad (Rewarded Popup) Shown/Closed.");
                     // Start cooldown after the ad is successfully displayed/interacted with.
                     startCooldown('static');
                })
                .catch(e => {
                     console.error("Static Ad (Rewarded Popup) Error:", e);
                     alert("Failed to show static ad. Please try again later.");
                     // Re-enable button if it was disabled before showing due to error
                     watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
                     // Do NOT start cooldown on error.
                });

            // Note: The whephiwums.com snippet also showed an In-App Interstitial format:
            // show_9237531({ type: 'inApp', inAppSettings: { ... } })
            // If you prefer this format for the static button, you would use that call instead,
            // but ensure you have appropriate event handling to know when to start the cooldown.
            // The 'pop' format is used here because its Promise-based structure integrates cleanly.


        } else {
            console.error("Whephiwums.com SDK function 'show_9237531' not found. Ensure SDK is loaded.");
            alert("Ad service not available. Please try again later.");
            // Re-enable button if SDK is not available
            watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
        }
    }

    // --- Button Click Handlers ---

    watchVideoBtn.addEventListener('click', () => {
        if (isCooldownOver(lastVideoAdTime)) {
            console.log("Video ad button clicked, cooldown over. Attempting to show ad.");
            // Temporarily disable button while ad is loading/showing
            watchVideoBtn.disabled = true;
            watchVideoBtn.innerText = 'Loading...'; // Or change to "Showing Ad..." once show is called
            loadAndShowVideoAd();
        } else {
            // This case should ideally not happen if the button is disabled correctly
            console.log("Video ad button clicked, but still on cooldown.");
        }
    });

    watchStaticBtn.addEventListener('click', () => {
        if (isCooldownOver(lastStaticAdTime)) {
            console.log("Static ad button clicked, cooldown over. Attempting to show ad.");
             // Temporarily disable button while ad is loading/showing
            watchStaticBtn.disabled = true;
            watchStaticBtn.innerText = 'Loading...'; // Or change to "Showing Ad..."
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
