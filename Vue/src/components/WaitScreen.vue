<script setup lang="ts">
import { inject } from "vue";
import type { Socket } from "socket.io-client";
import GameCode from "./GameCode.vue";
import type {
  Player,
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = inject(
  "socket"
) as Socket<ServerToClientEvents, ClientToServerEvents>;

const props = defineProps<{
  player: Player;
  code: string;
}>();

const emit = defineEmits<{
  (e: "leave-game"): void;
}>();

const handleLeaveGameClick = (): void => {
  socket.emit("leave-game");
  emit("leave-game");
};
</script>

<template>
  <div class="modal">
    <div id="config-container">
      <GameCode v-if="props.player === 1" :code="code" />
      <h3>Please wait for the other player</h3>
      <button @click="handleLeaveGameClick">Leave game</button>
    </div>
  </div>
</template>

<style scoped>
#config-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  min-width: 300px;
  max-width: 600px;
  gap: 2rem;
  background-color: #ececec;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border: 3px solid var(--color-text);
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  inset: 0;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
