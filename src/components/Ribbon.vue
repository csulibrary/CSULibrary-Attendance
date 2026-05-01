<template>
  <div class="csu-ribbon-wrap">
    <div class="page-inner">
      <div class="csu-ribbon">
        <span class="csu-ribbon-title">
          <slot></slot>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.csu-ribbon-wrap {
  width: 100%;
  padding: 12px 0 8px;
  position: relative;
}

.page-inner {
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 0 32px;
  box-sizing: border-box;
}

.csu-ribbon {
  position: relative;
  width: 100%;
  height: 48px;
  background: #0d2b0f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.csu-ribbon::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 34px;
  height: 48px;
  background: #f3f4f6;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}

.csu-ribbon::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid #0d2b0f;
  border-right: 12px solid transparent;
}

.csu-ribbon-title {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  margin: 0;
  text-align: center;
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 48px;
  letter-spacing: 0.3px;
}
</style>