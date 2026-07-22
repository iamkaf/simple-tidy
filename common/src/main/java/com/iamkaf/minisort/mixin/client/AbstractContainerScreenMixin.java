package com.iamkaf.minisort.mixin.client;

import com.iamkaf.minisort.network.MiniSortNetwork;
import com.iamkaf.minisort.sort.SortMenuPolicy;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.Tooltip;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.world.inventory.AbstractContainerMenu;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(AbstractContainerScreen.class)
public abstract class AbstractContainerScreenMixin extends Screen {
    @Shadow
    protected AbstractContainerMenu menu;

    @Shadow
    protected int leftPos;

    @Shadow
    protected int topPos;

    protected AbstractContainerScreenMixin(Component title) {
        super(title);
    }

    @Inject(method = "init", at = @At("TAIL"))
    private void miniSort$addSortButton(CallbackInfo callbackInfo) {
        if (!SortMenuPolicy.supportsContainerSort(menu)) {
            return;
        }

        Button button = Button.builder(Component.literal("↕"), ignored -> MiniSortNetwork.sortContainer(menu.containerId))
                .bounds(leftPos + 178, topPos + 4, 18, 18)
                .tooltip(Tooltip.create(Component.translatable("gui.minisort.sort_container")))
                .build();
        addRenderableWidget(button);
    }
}
