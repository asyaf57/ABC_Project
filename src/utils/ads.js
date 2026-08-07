export const AdsManager = {
  playCount: 0,
  
  incrementPlayCount() {
    this.playCount++;
    // Tampilkan interstitial setiap 3 kali permainan selesai
    if (this.playCount >= 3) {
        this.showInterstitial();
        this.playCount = 0; // reset
    }
  },

  showInterstitial() {
    if (window.AndroidAds && typeof window.AndroidAds.showInterstitial === 'function') {
      window.AndroidAds.showInterstitial();
    } else {
      console.log("AdMob: Interstitial Ad Requested (Not in Android App)");
    }
  },

  showRewarded(onRewardCallback) {
    if (window.AndroidAds && typeof window.AndroidAds.showRewarded === 'function') {
      // Set the global callback
      window.onRewardEarned = (type, amount) => {
        if(onRewardCallback) onRewardCallback(true);
      };
      window.onRewardedClosed = () => {
         // Optionally handle when closed without reward
      };
      window.AndroidAds.showRewarded();
    } else {
      console.log("AdMob: Rewarded Ad Requested (Not in Android App)");
      // Mock reward for web testing
      setTimeout(() => {
          if(onRewardCallback) onRewardCallback(true);
      }, 1000);
    }
  },

  showBanner() {
    if (window.AndroidAds && typeof window.AndroidAds.showBanner === 'function') {
      window.AndroidAds.showBanner();
    } else {
      console.log("AdMob: Banner Ad Show Requested (Not in Android App)");
    }
  },

  hideBanner() {
    if (window.AndroidAds && typeof window.AndroidAds.hideBanner === 'function') {
      window.AndroidAds.hideBanner();
    } else {
      console.log("AdMob: Banner Ad Hide Requested (Not in Android App)");
    }
  }
};
