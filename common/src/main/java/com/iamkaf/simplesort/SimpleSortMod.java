package com.iamkaf.simplesort;

import com.iamkaf.amber.api.core.v2.AmberInitializer;
import com.iamkaf.simplesort.network.SimpleSortNetwork;

public final class SimpleSortMod {
    private static boolean initialized;

    private SimpleSortMod() {
    }

    public static synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;

        AmberInitializer.initialize(SimpleSort.MOD_ID);
        SimpleSortNetwork.init();
        SimpleSort.LOG.info("Initialized {}", SimpleSort.MOD_NAME);
    }
}
