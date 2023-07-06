/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree";
import type { RootStore } from "../RootStore";
import { storage } from "@/shared";

/**
 * The key we'll be saving our state as within async storage.
 */
export const ROOT_STATE_STORAGE_KEY = "root-v1";

/**
 * Setup the root state.
 */
let _disposer: IDisposer | undefined;
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: any;

  try {
    // load the last known state from AsyncStorage
    restoredState = (await storage.get(ROOT_STATE_STORAGE_KEY)) || {};

    applySnapshot(rootStore, restoredState);
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
  }

  // stop tracking state changes if we've already setup
  if (_disposer) {
    _disposer();
  }

  // track changes & save to AsyncStorage
  _disposer = onSnapshot(rootStore, (snapshot) => {
    // console.log("snapshot", snapshot)
    storage.set(ROOT_STATE_STORAGE_KEY, snapshot);
  });

  const unsubscribe = () => {
    _disposer?.();
    _disposer = undefined;
  };

  return { rootStore, restoredState, unsubscribe };
}
