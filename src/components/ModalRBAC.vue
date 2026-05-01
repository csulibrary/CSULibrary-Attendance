<script setup>
defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-root">
      <div class="backdrop" @click="emit('close')" />

      <div class="dialog-wrapper">
        <div class="dialog">
          <div class="glow" />
          <div class="top-line" />

          <div class="icon-area">
            <div class="icon-ring">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <div class="pulse-ring" />
          </div>

          <div class="content">
            <p class="eyebrow">Error 403</p>
            <h2 class="title">Access Denied</h2>
            <p class="description">
              You don't have permission to make changes on this page. Contact your administrator to
              request access.
            </p>
          </div>

          <div class="divider" />

          <div class="actions">
            <button class="btn-secondary" @click="emit('close')">Go Back</button>
            <button class="btn-primary" @click="emit('confirm')">Understood</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

/* layout */
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
}
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 8, 0.82);
  backdrop-filter: blur(12px);
}
.dialog-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
}

/* dialog */
.dialog {
  position: relative;
  padding: 2.25rem 2rem 2rem;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(160deg, #16151c, #0f0e14);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 32px 64px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(0, 0, 0, 0.4);
}

/* accents */
.glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  height: 160px;
  background: radial-gradient(ellipse, rgba(22, 163, 74, 0.2), transparent 70%);
  filter: blur(10px);
}
.top-line {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.55), transparent);
}

/* icon */
.icon-area {
  display: flex;
  justify-content: center;
  margin: 0 auto 1.5rem;
  position: relative;
  width: fit-content;
}
.icon-ring,
.pulse-ring {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-ring {
  width: 56px;
  height: 56px;
  z-index: 1;
  background: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.28);
  color: #4ade80;
}
.icon-ring svg {
  width: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.25;
}
.pulse-ring {
  position: absolute;
  inset: -8px;
  border: 1px solid rgba(34, 197, 94, 0.15);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

/* text */
.content {
  text-align: center;
}
.eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.65);
  margin-bottom: 0.5rem;
}
.title {
  font-family: 'Playfair Display', serif;
  font-size: 1.625rem;
  color: #f4f3f8;
  margin-bottom: 0.75rem;
}
.description {
  font-size: 0.875rem;
  line-height: 1.65;
  color: rgba(200, 198, 212, 0.65);
}

/* divider */
.divider {
  margin: 1.75rem 0 1.5rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
}

/* buttons */
.actions {
  display: flex;
  gap: 0.625rem;
}
.btn-secondary,
.btn-primary {
  padding: 0.6875rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: 0.18s;
}
.btn-secondary {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(200, 198, 212, 0.7);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(220, 218, 232, 0.9);
}

.btn-primary {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, rgba(15, 118, 54, 0.85), rgba(22, 163, 74, 0.85));
  border: 1px solid rgba(1, 44, 17, 0.35);
  color: #dcfce7;
}
.btn-primary:hover {
  transform: translateY(-1px);
}
.btn-arrow {
  width: 14px;
}

/* animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .dialog {
  animation: in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-leave-active .dialog {
  animation: out 0.2s forwards;
}
@keyframes in {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes out {
  to {
    opacity: 0;
    transform: scale(0.96);
  }
}
</style>
