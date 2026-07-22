package com.iamkaf.minisort;

import com.iamkaf.amber.api.core.v2.AmberInitializer;
import com.iamkaf.minisort.network.MiniSortNetwork;

public final class MiniSortMod {
    private static boolean initialized;

    private MiniSortMod() {
    }

    public static synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;

        AmberInitializer.initialize(MiniSort.MOD_ID);
        MiniSortNetwork.init();
        MiniSort.LOG.info("Initialized {}", MiniSort.MOD_NAME);
    }
}
