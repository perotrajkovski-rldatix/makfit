import { Capacitor, registerPlugin } from '@capacitor/core';

export interface IOSBillingProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  billingPeriod?: string;
}

export interface IOSBillingPurchase {
  productId: string;
  purchaseToken: string;
  acknowledged: boolean;
  autoRenewing: boolean;
  purchaseTime: number;
}

export interface IOSRestoredPurchase {
  productId: string;
  purchaseToken: string;
}

interface CapacitorWithPlugins {
  Plugins?: Record<string, unknown>;
}

interface StoreKitBillingPlugin {
  getProducts(options: { productIds: string[] }): Promise<{ products: IOSBillingProduct[] }>;
  purchaseSubscription(options: { productId: string }): Promise<{ success: boolean }>;
  getActiveSubscriptions(): Promise<{ purchases: IOSBillingPurchase[] }>;
  restorePurchases(): Promise<{ purchases: IOSBillingPurchase[] }>;
  addListener(
    eventName: 'purchaseRestored',
    listenerFunc: (data: IOSRestoredPurchase) => void,
  ): Promise<import('@capacitor/core').PluginListenerHandle>;
}

export function isStoreKitBridgeAvailable(): boolean {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return false;
  }

  if (typeof Capacitor.isPluginAvailable === 'function') {
    if (Capacitor.isPluginAvailable('StoreKitBilling')) {
      return true;
    }
  }

  // On some builds a JS proxy can exist even when the native plugin is not packaged.
  const nativePlugins = (Capacitor as unknown as CapacitorWithPlugins).Plugins;
  return Boolean(nativePlugins?.StoreKitBilling);
}

export const StoreKitBilling = registerPlugin<StoreKitBillingPlugin>('StoreKitBilling');
