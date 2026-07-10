package com.iamkaf.simpletidy.network;

import com.iamkaf.amber.api.networking.v1.Packet;
import com.iamkaf.amber.api.networking.v1.PacketDecoder;
import com.iamkaf.amber.api.networking.v1.PacketEncoder;
import com.iamkaf.amber.api.networking.v1.PacketHandler;
import com.iamkaf.simpletidy.sort.SortService;
import net.minecraft.server.level.ServerPlayer;

public record SortContainerPayload(int containerId, SortTarget target, SortMode mode)
        implements Packet<SortContainerPayload> {
    public static final PacketEncoder<SortContainerPayload> ENCODER = (packet, buffer) -> {
        buffer.writeInt(packet.containerId);
        buffer.writeByte(packet.target.networkId);
        buffer.writeByte(packet.mode.networkId);
    };

    public static final PacketDecoder<SortContainerPayload> DECODER = buffer -> new SortContainerPayload(
            buffer.readInt(),
            SortTarget.fromNetworkId(buffer.readUnsignedByte()),
            SortMode.fromNetworkId(buffer.readUnsignedByte())
    );

    public static final PacketHandler<SortContainerPayload> HANDLER = (packet, context) -> {
        if (!context.isServerSide()) {
            return;
        }
        context.execute(() -> {
            ServerPlayer player = context.getServerPlayer();
            if (player != null) {
                SortService.sort(player, packet);
            }
        });
    };

    public enum SortTarget {
        CONTAINER(0);

        private final int networkId;

        SortTarget(int networkId) {
            this.networkId = networkId;
        }

        private static SortTarget fromNetworkId(int networkId) {
            if (networkId == CONTAINER.networkId) {
                return CONTAINER;
            }
            throw new IllegalArgumentException("Unknown sort target");
        }
    }

    public enum SortMode {
        REGISTRY_ID(0);

        private final int networkId;

        SortMode(int networkId) {
            this.networkId = networkId;
        }

        private static SortMode fromNetworkId(int networkId) {
            if (networkId == REGISTRY_ID.networkId) {
                return REGISTRY_ID;
            }
            throw new IllegalArgumentException("Unknown sort mode");
        }
    }
}
