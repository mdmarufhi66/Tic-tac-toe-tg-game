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
            // Clear any existing timer
            if (videoCooldownTimer) clearInterval(videoCooldownTimer);
        } else if (adType === 'static') {
            lastStaticAdTime = now;
            button = watchStaticBtn;
            storageKey = COOWN_STORAGE_KEY_STATIC; // Typo corrected: COOLDOWN_STORAGE_KEY_STATIC
            button = watchStaticBtn;
            storageKey = COOLDOWN_STORAGE_KEY_STATIC; // Corrected again
            timerVariable = 'staticCooldownTimer';
            // Clear any existing timer
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
        updateCountdown(); // Initial update
        if (adType === 'video') videoCooldownTimer = setInterval(updateCountdown, 1000);
        else staticCooldownTimer = setInterval(updateCountdown, 1000);
    }


    // --- Function to initialize button states on load ---
    function initializeButtonStates() {
        if (!isCooldownOver(lastVideoAdTime)) {
            startCooldown('video'); // Restart cooldown timer if still active
        } else {
            watchVideoBtn.disabled = false;
            watchVideoBtn.innerText = 'Watch Video Ads';
        }

        if (!isCooldownOver(lastStaticAdTime)) {
            startCooldown('static'); // Restart cooldown timer if still active
        } else {
            watchStaticBtn.disabled = false;
            watchStaticBtn.innerText = 'Watch Static Ads';
        }
    }

    // --- Monetag Ad Loading and Showing (PLACEHOLDER FUNCTIONS) ---

    // *** YOU NEED TO REPLACE THESE FUNCTIONS WITH YOUR ACTUAL MONETAG SDK CALLS ***
    // Consult Monetag documentation for the exact methods to load and show
    // Rewarded Interstitial and Rewarded Popup ads, and how to handle their events.

    function loadAndShowVideoAd() {
        console.log("Attempting to load and show Video Ad...");
        // Example Placeholder: Assuming Monetag has a load/show pattern with callbacks
        if (typeof MonetagSDK !== 'undefined' && MonetagSDK.loadInterstitial) { // Check if SDK is loaded
             // REPLACE THIS SECTION WITH ACTUAL MONETAG VIDEO AD LOGIC
             // This is a generic example pattern
             MonetagSDK.loadInterstitial({
                 // Your video ad zone ID and other parameters
                 zoneId: 'YOUR_VIDEO_AD_ZONE_ID',
                 onLoaded: function() {
                     console.log("Video Ad Loaded");
                     MonetagSDK.showInterstitial({
                          onComplete: function() {
                              console.log("Video Ad Watched/Completed (Monetag's reward event)");
                              startCooldown('video'); // Start cooldown after successful watch
                          },
                          onClose: function() {
                              console.log("Video Ad Closed (might fire before or after onComplete)");
                              // Depending on Monetag, onComplete might be the reliable event for reward
                              // If no onComplete equivalent, you might start cooldown here, but verify reward condition
                          },
                          onError: function(error) {
                              console.error("Video Ad Error:", error);
                              alert("Failed to load or show video ad. Please try again later.");
                              // Re-enable button if it was disabled before showing
                              watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
                          }
                     });
                 },
                 onError: function(error) {
                     console.error("Video Ad Load Error:", error);
                     alert("Failed to load video ad. Please try again later.");
                     // Re-enable button
                     watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
                 }
             });
        } else {
            console.error("Monetag SDK or loadInterstitial function not found.");
            alert("Ad service not available. Please try again later.");
            watchVideoBtn.disabled = !isCooldownOver(lastVideoAdTime);
        }
    }

     function loadAndShowStaticAd() {
        console.log("Attempting to load and show Static Ad...");
        // Example Placeholder: Assuming Monetag has a load/show pattern for Popups/Static ads
         if (typeof MonetagSDK !== 'undefined' && MonetagSDK.loadPopup) { // Check if SDK is loaded
              // REPLACE THIS SECTION WITH ACTUAL MONETAG STATIC AD LOGIC
              // This is a generic example pattern
             MonetagSDK.loadPopup({
                 // Your static ad zone ID and other parameters
                 zoneId: 'YOUR_STATIC_AD_ZONE_ID',
                 onLoaded: function() {
                      console.log("Static Ad Loaded");
                      MonetagSDK.showPopup({
                           onComplete: function() {
                               console.log("Static Ad Watched/Completed (Monetag's reward event)");
                               startCooldown('static'); // Start cooldown after successful watch
                           },
                           onClose: function() {
                               console.log("Static Ad Closed");
                               // Depending on Monetag, onComplete might be the reliable event for reward
                           },
                           onError: function(error) {
                               console.error("Static Ad Error:", error);
                               alert("Failed to load or show static ad. Please try again later.");
                               // Re-enable button if it was disabled before showing
                               watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
                           }
                      });
                 },
                  onError: function(error) {
                      console.error("Static Ad Load Error:", error);
                      alert("Failed to load static ad. Please try again later.");
                      // Re-enable button
                      watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
                  }
             });
         } else {
             console.error("Monetag SDK or loadPopup function not found.");
             alert("Ad service not available. Please try again later.");
             watchStaticBtn.disabled = !isCooldownOver(lastStaticAdTime);
         }
    }

    // --- Button Click Handlers ---

    watchVideoBtn.addEventListener('click', () => {
        if (isCooldownOver(lastVideoAdTime)) {
            // Temporarily disable button while ad is loading/showing
            watchVideoBtn.disabled = true;
            watchVideoBtn.innerText = 'Loading...';
            loadAndShowVideoAd();
        } else {
            // This case should ideally not happen if the button is disabled correctly
            console.log("Video ad is still on cooldown.");
        }
    });

    watchStaticBtn.addEventListener('click', () => {
        if (isCooldownOver(lastStaticAdTime)) {
             // Temporarily disable button while ad is loading/showing
            watchStaticBtn.disabled = true;
            watchStaticBtn.innerText = 'Loading...';
            loadAndShowStaticAd();
        } else {
             // This case should ideally not happen if the button is disabled correctly
            console.log("Static ad is still on cooldown.");
        }
    });

    // --- Initialize on page load ---
    initializeButtonStates();

    // --- Telegram Web App Ready ---
    // Optional: You can add TG specific logic here if needed later
    Telegram.WebApp.ready();
    console.log('Telegram Web App is ready.');
    // Telegram.WebApp.expand(); // Optional: Expand the app to full height immediately

});
