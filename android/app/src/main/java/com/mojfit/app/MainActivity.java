package com.mojfit.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void load() {
        // Register custom plugins before bridge initialization so JS can discover them.
        registerPlugin(GoogleAuth.class);
        registerPlugin(PlayBillingPlugin.class);
        super.load();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Force WebView to revalidate cached resources on every resume.
        // This ensures that after a Play Store update the new bundle is loaded
        // instead of the stale cached index.html / JS assets.
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        }
    }
}