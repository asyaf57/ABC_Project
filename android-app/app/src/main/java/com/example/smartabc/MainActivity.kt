package com.example.smartabc

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import androidx.activity.ComponentActivity
import androidx.activity.addCallback
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var adView: AdView? = null
    private var mainLayout: LinearLayout? = null
    
    private var appOpenAd: AppOpenAd? = null
    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null
    private var isShowingAd = false

    private val TAG = "SmartABC_Ads"

    // User's Ad IDs
    private val appOpenAdUnitId = "ca-app-pub-3007303797157945/5100412267"
    private val interstitialAdUnitId = "ca-app-pub-3007303797157945/3595758909"
    // Using test IDs for banner and rewarded until user provides them
    private val bannerAdUnitId = "ca-app-pub-3940256099942544/6300978111" 
    private val rewardedAdUnitId = "ca-app-pub-3940256099942544/5224354917"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        MobileAds.initialize(this) {
            loadAppOpenAd()
            loadInterstitialAd()
            loadRewardedAd()
        }

        mainLayout = LinearLayout(this)
        mainLayout?.orientation = LinearLayout.VERTICAL
        mainLayout?.layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )

        webView = WebView(this)
        webView.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1.0f // Weight 1, takes all available space
        )
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        
        // Setup JavaScript Interface
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidAds")

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        
        mainLayout?.addView(webView)
        setContentView(mainLayout)
        
        // Load the web app
        // NOTE: For local testing during dev, use http://10.0.2.2:5173
        webView.loadUrl("https://smartabc.netlify.app")

        // Handle Android back button
        onBackPressedDispatcher.addCallback(this) {
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
            }
        }
    }

    // --- APP OPEN AD ---
    private fun loadAppOpenAd() {
        val request = AdRequest.Builder().build()
        AppOpenAd.load(
            this, appOpenAdUnitId, request,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpenAd = ad
                    showAppOpenAdIfAvailable()
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.d(TAG, "AppOpenAd failed to load: ${loadAdError.message}")
                }
            }
        )
    }

    private fun showAppOpenAdIfAvailable() {
        if (!isShowingAd && appOpenAd != null) {
            appOpenAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    appOpenAd = null
                    isShowingAd = false
                    loadAppOpenAd()
                }
                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    isShowingAd = false
                }
                override fun onAdShowedFullScreenContent() {
                    isShowingAd = true
                }
            }
            appOpenAd?.show(this)
        }
    }

    // --- INTERSTITIAL AD ---
    fun loadInterstitialAd() {
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(this, interstitialAdUnitId, adRequest, object : InterstitialAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                interstitialAd = null
            }
            override fun onAdLoaded(ad: InterstitialAd) {
                interstitialAd = ad
            }
        })
    }

    fun showInterstitialAd() {
        runOnUiThread {
            if (interstitialAd != null) {
                interstitialAd?.fullScreenContentCallback = object: FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        interstitialAd = null
                        loadInterstitialAd()
                        // Notify React app that ad was closed
                        webView.evaluateJavascript("window.onInterstitialClosed && window.onInterstitialClosed();", null)
                    }
                }
                interstitialAd?.show(this)
            } else {
                Log.d(TAG, "The interstitial ad wasn't ready yet.")
                loadInterstitialAd()
                // If not ready, just pretend it closed so the user is not blocked
                webView.evaluateJavascript("window.onInterstitialClosed && window.onInterstitialClosed();", null)
            }
        }
    }

    // --- REWARDED AD ---
    fun loadRewardedAd() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(this, rewardedAdUnitId, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                rewardedAd = null
            }
            override fun onAdLoaded(ad: RewardedAd) {
                rewardedAd = ad
            }
        })
    }

    fun showRewardedAd() {
        runOnUiThread {
            if (rewardedAd != null) {
                rewardedAd?.fullScreenContentCallback = object: FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        rewardedAd = null
                        loadRewardedAd()
                        webView.evaluateJavascript("window.onRewardedClosed && window.onRewardedClosed();", null)
                    }
                }
                rewardedAd?.show(this) { rewardItem ->
                    // Notify WebView that reward was earned
                    webView.evaluateJavascript("window.onRewardEarned && window.onRewardEarned('${rewardItem.type}', ${rewardItem.amount});", null)
                }
            } else {
                Log.d(TAG, "The rewarded ad wasn't ready yet.")
                loadRewardedAd()
                webView.evaluateJavascript("window.onRewardedClosed && window.onRewardedClosed();", null)
            }
        }
    }

    // --- BANNER AD ---
    fun showBannerAd() {
        runOnUiThread {
            if (adView == null) {
                adView = AdView(this)
                adView?.setAdSize(AdSize.BANNER)
                adView?.adUnitId = bannerAdUnitId
                
                mainLayout?.addView(adView)
                
                val adRequest = AdRequest.Builder().build()
                adView?.loadAd(adRequest)
            } else {
                adView?.visibility = View.VISIBLE
            }
        }
    }

    fun hideBannerAd() {
        runOnUiThread {
            adView?.visibility = View.GONE
        }
    }

    override fun onDestroy() {
        adView?.destroy()
        super.onDestroy()
    }
}

// --- JAVASCRIPT INTERFACE ---
class WebAppInterface(private val activity: MainActivity) {
    
    @JavascriptInterface
    fun showInterstitial() {
        activity.showInterstitialAd()
    }

    @JavascriptInterface
    fun showRewarded() {
        activity.showRewardedAd()
    }

    @JavascriptInterface
    fun showBanner() {
        activity.showBannerAd()
    }

    @JavascriptInterface
    fun hideBanner() {
        activity.hideBannerAd()
    }
}
