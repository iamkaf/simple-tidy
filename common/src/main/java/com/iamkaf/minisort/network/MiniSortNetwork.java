package com.iamkaf.minisort.network;

import com.iamkaf.amber.api.networking.v1.NetworkChannel;
import com.iamkaf.minisort.MiniSort;

public final class MiniSortNetwork {
    private static final NetworkChannel CHANNEL = NetworkChannel.create(MiniSort.resource("main"));
    private static boolean initialized;

    private MiniSortNetwork() {
    }

    public static synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;
        CHANNEL.register(
                SortContainerPayload.class,
                SortContainerPayload.ENCODER,
                SortContainerPayload.DECODER,
                SortContainerPayload.HANDLER
        );
    }

    public static void sortContainer(int containerId) {
        CHANNEL.sendToServer(new SortContainerPayload(
                containerId,
                SortContainerPayload.SortTarget.CONTAINER,
                SortContainerPayload.SortMode.REGISTRY_ID
        ));
    }
}
