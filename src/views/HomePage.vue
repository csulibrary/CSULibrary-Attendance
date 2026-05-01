<template>
  <div class="w-full">
    <!-- CAROUSEL -->
    <div v-if="isMediaLoaded && carouselItems.length" class="relative w-full overflow-hidden">
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * slideWidth}%)` }"
      >
        <div v-for="(media, index) in carouselItems" :key="media.id || index" class="min-w-[100%]">
          <img
            v-if="media.type === 'image'"
            :src="media.src"
            :alt="media.alt"
            class="w-full object-cover"
            :style="{ height: imageHeight }"
          />
          <video
            v-else
            :src="media.src"
            class="w-full object-cover"
            :style="{ height: imageHeight }"
            autoplay
            muted
            loop
            playsinline
          ></video>
        </div>
      </div>
      <button
        @click="prev"
        class="absolute left-2 top-1/2 -translate-y-1/2 text-[#1a1a1a] bg-transparent hover:bg-[#f9dc07] transition opacity-0 hover:opacity-100 p-2 rounded-full"
      >
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="next"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-[#1a1a1a] bg-transparent hover:bg-[#f9dc07] transition opacity-0 hover:opacity-100 p-2 rounded-full"
      >
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          v-for="(_, i) in carouselItems"
          :key="i"
          @click="currentIndex = i"
          class="w-2 h-2 rounded-full transition-all"
          :class="currentIndex === i ? 'bg-[#fbc02d] w-2' : 'bg-[#fbc02d]/50'"
        />
      </div>
    </div>

    <div
      v-else
      class="w-full flex items-center justify-center"
      :style="{ height: imageHeight, background: '#ffffff' }"
    >
      <span style="color: rgba(13, 43, 15, 0.55); font-weight: 700">Loading carousel...</span>
    </div>
  </div>

  <!-- TAGLINE -->
  <div class="sr-item w-full py-10 flex flex-col items-center gap-3">
    <div class="flex items-center gap-3 mb-2">
      <div style="width: 40px; height: 1px; background: #1b5e20; opacity: 0.4"></div>
      <span
        style="
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.35em;
          color: #003300;
          text-transform: uppercase;
        "
        >CSU Library System</span
      >
      <div style="width: 40px; height: 1px; background: #1b5e20; opacity: 0.4"></div>
    </div>
    <h2
      class="font-bold tracking-widest text-center"
      style="font-family: 'Cinzel', serif; font-size: 2.5rem; line-height: 1.2"
    >
      <span
        class="animate-fade-in inline-block"
        style="animation-delay: 0s; animation-fill-mode: both; color: #003300"
        >HERO</span
      >
      <span
        class="animate-fade-in inline-block mx-2"
        style="animation-delay: 0.4s; animation-fill-mode: both; color: #009900"
        >LEARNING</span
      >
      <span
        class="animate-fade-in inline-block"
        style="animation-delay: 0.8s; animation-fill-mode: both; color: #f9dc07"
        >COMMONS</span
      >
    </h2>
    <p
      class="animate-fade-in text-center"
      style="
        animation-delay: 1.1s;
        animation-fill-mode: both;
        font-size: 0.78rem;
        letter-spacing: 0.2em;
        color: #003300;
        text-transform: uppercase;
        font-weight: 600;
      "
    >
      Caraga State University · Butuan City
    </p>
    <div
      class="animate-fade-in flex items-center gap-2 mt-1"
      style="animation-delay: 1.3s; animation-fill-mode: both"
    >
      <div style="width: 6px; height: 6px; border-radius: 50%; background: #003300"></div>
      <div style="width: 30px; height: 2px; background: #1b5e20; border-radius: 2px"></div>
      <div style="width: 8px; height: 8px; border-radius: 50%; background: #f9dc07"></div>
      <div style="width: 30px; height: 2px; background: #1b5e20; border-radius: 2px"></div>
      <div style="width: 6px; height: 6px; border-radius: 50%; background: #003300"></div>
    </div>
  </div>

  <!-- CSU LIBRARY -->
  <div
    class="w-full flex justify-center py-12 px-6 mt-8 relative"
    :style="{
      backgroundImage: `url(${libraryBgImage})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '500px auto',
    }"
  >
    <div class="absolute inset-0" style="background: rgba(13, 43, 15, 0.88)"></div>
    <div class="w-[100%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
      <div class="sr-left w-full h-full flex justify-center">
        <img :src="libraryMainImage" alt="Students" class="w-full h-full object-cover rounded-sm" />
      </div>
      <div class="sr-right flex flex-col text-white px-4 relative">
        <div style="width: 60px; height: 4px; background: #f9dc07; margin-bottom: 16px"></div>
        <div class="mb-4">
          <span
            style="
              background: #f9dc07;
              color: #003300;
              font-size: 0.75rem;
              font-weight: 900;
              letter-spacing: 0.15em;
              padding: 4px 12px;
              border-radius: 4px;
            "
            >CSU LIBRARY</span
          >
        </div>
        <h2
          class="mb-4"
          style="color: white; font-size: 1.9rem; font-weight: 900; letter-spacing: 0.1em"
        >
          Caraga State University Library
        </h2>
        <div class="mb-4">
          <div
            style="
              width: 100%;
              height: 1px;
              background: linear-gradient(to right, #f9dc07, transparent);
            "
          ></div>
        </div>
        <p class="text-white/80 text-base leading-relaxed mb-6" style="text-align: justify">
          The CSU Library Service Unit aims to support and achieve the educational objectives of
          CSU. It seeks relevant materials and services; and provide these to fulfull the vision,
          mission goals and objectives of the State College to respond to the changing needs of the
          clientele and the curricular offerings.
        </p>
      </div>
    </div>
  </div>

  <!-- READ LEARN DISCOVER -->
  <div class="w-full overflow-hidden" style="background: #ffffff; position: relative">
    <div class="w-[100%] mx-auto px-6 py-20 relative z-10">
      <div class="sr-item flex flex-col items-center mb-16 gap-3 text-center">
        <p
          style="
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.3em;
            color: #003300;
            text-transform: uppercase;
          "
        >
          &nbsp;CSU Library Experience
        </p>
        <h2
          style="
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 900;
            color: #003300;
            line-height: 1;
            letter-spacing: -0.03em;
            text-align: center;
          "
        >
          Read.<span style="color: #009900">Learn.</span
          ><span style="color: #f9dc07">Discover.</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="sr-card rld-card relative overflow-hidden cursor-pointer"
          style="border-radius: 16px; border: 1px solid rgba(13, 43, 15, 0.12); min-height: 480px"
          onmouseenter="
            this.querySelector('.rld-img').style.transform = 'scale(1.08)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            })
            this.querySelector('.rld-num').style.opacity = '1'
            this.querySelector('.rld-line').style.width = '64px'
          "
          onmouseleave="
            this.querySelector('.rld-img').style.transform = 'scale(1)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '0'
              el.style.transform = 'translateY(8px)'
            })
            this.querySelector('.rld-num').style.opacity = '0.4'
            this.querySelector('.rld-line').style.width = '32px'
          "
        >
          <img
            :src="rldImage1"
            alt="Read"
            class="rld-img absolute inset-0 w-full h-full object-cover"
            style="transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          />
          <div
            class="absolute inset-0"
            style="
              background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.85) 0%,
                rgba(0, 0, 0, 0.2) 40%,
                transparent 70%
              );
            "
          ></div>
          <div class="absolute top-5 left-5">
            <span
              style="
                font-size: 0.62rem;
                font-weight: 800;
                letter-spacing: 0.2em;
                color: #f9dc07;
                text-transform: uppercase;
                background: rgba(249, 220, 7, 0.15);
                background: rgba(255, 153, 0, 0.15);
                padding: 4px 10px;
                border-radius: 20px;
              "
              >Collection</span
            >
          </div>
          <div class="absolute inset-0 flex flex-col justify-end p-7">
            <span
              class="rld-num font-black"
              style="
                font-size: 5.5rem;
                color: white;
                line-height: 1;
                letter-spacing: -0.05em;
                opacity: 0.4;
                transition: opacity 0.4s ease;
                display: block;
                margin-bottom: -8px;
              "
              >01</span
            >
            <h3
              style="
                font-size: 2.4rem;
                font-weight: 900;
                color: white;
                line-height: 1;
                letter-spacing: -0.02em;
              "
              class="mb-3"
            >
              Read
            </h3>
            <div
              class="rld-line"
              style="
                height: 2px;
                width: 32px;
                background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
                margin-bottom: 14px;
                transition: width 0.4s ease;
                border-radius: 2px;
              "
            ></div>
            <p
              class="rld-desc"
              style="
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.75);
                line-height: 1.7;
                opacity: 0;
                transform: translateY(8px);
                transition: all 0.4s ease;
                max-width: 240px;
              "
            >
              Dive into thousands of books, journals, and publications spanning every field of
              knowledge.
            </p>
            <div
              class="rld-desc mt-4 flex items-center gap-2"
              style="opacity: 0; transform: translateY(8px); transition: all 0.45s ease"
            ></div>
          </div>
        </div>

        <div
          class="sr-card rld-card relative overflow-hidden cursor-pointer"
          style="
            border-radius: 16px;
            border: 1px solid rgba(249, 168, 37, 0.3);
            min-height: 480px;
            transition-delay: 0.12s;
          "
          onmouseenter="
            this.querySelector('.rld-img').style.transform = 'scale(1.08)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            })
            this.querySelector('.rld-num').style.opacity = '1'
            this.querySelector('.rld-line').style.width = '64px'
          "
          onmouseleave="
            this.querySelector('.rld-img').style.transform = 'scale(1)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '0'
              el.style.transform = 'translateY(8px)'
            })
            this.querySelector('.rld-num').style.opacity = '0.4'
            this.querySelector('.rld-line').style.width = '32px'
          "
        >
          <img
            :src="rldImage2"
            alt="Learn"
            class="rld-img absolute inset-0 w-full h-full object-cover"
            style="transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          />
          <div
            class="absolute inset-0"
            style="
              background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.85) 0%,
                rgba(0, 0, 0, 0.2) 40%,
                transparent 70%
              );
            "
          ></div>
          <div
            class="absolute top-0 left-0 right-0"
            style="
              height: 2px;
              background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
            "
          ></div>
          <div class="absolute top-5 left-5">
            <span
              style="
                font-size: 0.62rem;
                font-weight: 800;
                letter-spacing: 0.2em;
                color: #f9dc07;
                text-transform: uppercase;
                background: rgba(249, 220, 7, 0.15);
                background: rgba(255, 153, 0, 0.15);
                padding: 4px 10px;
                border-radius: 20px;
              "
              >Featured</span
            >
          </div>
          <div class="absolute inset-0 flex flex-col justify-end p-7">
            <span
              class="rld-num font-black"
              style="
                font-size: 5.5rem;
                color: white;
                line-height: 1;
                letter-spacing: -0.05em;
                opacity: 0.4;
                transition: opacity 0.4s ease;
                display: block;
                margin-bottom: -8px;
              "
              >02</span
            >
            <h3
              style="
                font-size: 2.4rem;
                font-weight: 900;
                color: white;
                line-height: 1;
                letter-spacing: -0.02em;
              "
              class="mb-3"
            >
              Learn
            </h3>
            <div
              class="rld-line"
              style="
                height: 2px;
                width: 32px;
                background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
                margin-bottom: 14px;
                transition: width 0.4s ease;
                border-radius: 2px;
              "
            ></div>
            <p
              class="rld-desc"
              style="
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.75);
                line-height: 1.7;
                opacity: 0;
                transform: translateY(8px);
                transition: all 0.4s ease;
                max-width: 240px;
              "
            >
              Access academic resources, research tools, and expert guidance to fuel your growth.
            </p>
            <div
              class="rld-desc mt-4 flex items-center gap-2"
              style="opacity: 0; transform: translateY(8px); transition: all 0.45s ease"
            ></div>
          </div>
        </div>

        <div
          class="sr-card rld-card relative overflow-hidden cursor-pointer"
          style="
            border-radius: 16px;
            border: 1px solid rgba(13, 43, 15, 0.12);
            min-height: 480px;
            transition-delay: 0.24s;
          "
          onmouseenter="
            this.querySelector('.rld-img').style.transform = 'scale(1.08)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            })
            this.querySelector('.rld-num').style.opacity = '1'
            this.querySelector('.rld-line').style.width = '64px'
          "
          onmouseleave="
            this.querySelector('.rld-img').style.transform = 'scale(1)'
            this.querySelectorAll('.rld-desc').forEach((el) => {
              el.style.opacity = '0'
              el.style.transform = 'translateY(8px)'
            })
            this.querySelector('.rld-num').style.opacity = '0.4'
            this.querySelector('.rld-line').style.width = '32px'
          "
        >
          <img
            :src="rldImage3"
            alt="Discover"
            class="rld-img absolute inset-0 w-full h-full object-cover"
            style="transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          />
          <div
            class="absolute inset-0"
            style="
              background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.85) 0%,
                rgba(0, 0, 0, 0.2) 40%,
                transparent 70%
              );
            "
          ></div>
          <div class="absolute top-5 left-5">
            <span
              style="
                font-size: 0.62rem;
                font-weight: 800;
                letter-spacing: 0.2em;
                color: #f9dc07;
                text-transform: uppercase;
                background: rgba(249, 220, 7, 0.15);
                background: rgba(255, 153, 0, 0.15);
                padding: 4px 10px;
                border-radius: 20px;
              "
              >Resources</span
            >
          </div>
          <div class="absolute inset-0 flex flex-col justify-end p-7">
            <span
              class="rld-num font-black"
              style="
                font-size: 5.5rem;
                color: white;
                line-height: 1;
                letter-spacing: -0.05em;
                opacity: 0.4;
                transition: opacity 0.4s ease;
                display: block;
                margin-bottom: -8px;
              "
              >03</span
            >
            <h3
              style="
                font-size: 2.4rem;
                font-weight: 900;
                color: white;
                line-height: 1;
                letter-spacing: -0.02em;
              "
              class="mb-3"
            >
              Discover
            </h3>
            <div
              class="rld-line"
              style="
                height: 2px;
                width: 32px;
                background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
                margin-bottom: 14px;
                transition: width 0.4s ease;
                border-radius: 2px;
              "
            ></div>
            <p
              class="rld-desc"
              style="
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.75);
                line-height: 1.7;
                opacity: 0;
                transform: translateY(8px);
                transition: all 0.4s ease;
                max-width: 240px;
              "
            >
              Uncover new ideas, collections, and services that inspire curiosity and innovation.
            </p>
            <div
              class="rld-desc mt-4 flex items-center gap-2"
              style="opacity: 0; transform: translateY(8px); transition: all 0.45s ease"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="sr-item flex items-center justify-between mt-10 pt-8"
        style="border-top: 1px solid rgba(13, 43, 15, 0.15)"
      >
        <div class="flex items-center gap-5">
          <span
            style="
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.15em;
              color: #003300;
              text-transform: uppercase;
            "
            >CSU Library</span
          >
          <div style="width: 1px; height: 12px; background: #003300; opacity: 0.3"></div>
          <span
            style="
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.15em;
              color: #003300;
              text-transform: uppercase;
            "
            >Butuan City</span
          >
        </div>
        <div class="flex gap-2">
          <div
            style="width: 6px; height: 6px; border-radius: 50%; background: rgba(249, 168, 37, 0.6)"
          ></div>
          <div
            style="width: 6px; height: 6px; border-radius: 50%; background: rgba(27, 94, 32, 0.5)"
          ></div>
          <div
            style="width: 6px; height: 6px; border-radius: 50%; background: rgba(13, 43, 15, 0.2)"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- LIBRARY SERVICES & RECOGNITION — commented out: wala pami data ana, i-uncomment kung ready na -->
  <!--
  <div
    class="w-full px-6 py-20 relative overflow-hidden"
    style="background: linear-gradient(160deg, #f0f4f0 0%, #e8efe8 50%, #f4f2ed 100%)"
  >
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background-image:
          linear-gradient(rgba(13, 43, 15, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(13, 43, 15, 0.035) 1px, transparent 1px);
        background-size: 52px 52px;
      "
    ></div>

    <div
      class="absolute pointer-events-none"
      style="
        width: 700px;
        height: 700px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(27, 94, 32, 0.08) 0%, transparent 65%);
        top: -250px;
        right: -200px;
      "
    ></div>
    <div
      class="absolute pointer-events-none"
      style="
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(249, 168, 37, 0.07) 0%, transparent 65%);
        bottom: -150px;
        left: -150px;
      "
    ></div>

    <div class="w-full mx-auto relative" style="z-index: 2; max-width: 1400px">
      <div class="sr-item flex flex-col items-center mb-16 text-center">
        <div class="flex items-center gap-3">
          <div style="width: 32px; height: 3px; background: #f9a825; border-radius: 2px"></div>
          <span
            style="
              font-size: 0.68rem;
              font-weight: 800;
              letter-spacing: 0.25em;
              color: #0d2b0f;
              text-transform: uppercase;
            "
            >Services & Recognition</span
          >
        </div>
        <h2
          style="
            font-size: clamp(2rem, 4.5vw, 3.2rem);
            font-weight: 900;
            color: #0d2b0f;
            line-height: 1;
            letter-spacing: -0.035em;
            margin: 0 0 12px;
          "
        >
          Library Services
          <span style="color: #f9a825; font-style: italic"> &amp; Recognition</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink
          :to="{ name: 'avr' }"
          class="sr-card group relative flex flex-col overflow-hidden"
          style="
            border-radius: 20px;
            background: #0d2b0f;
            border: 1px solid rgba(249, 168, 37, 0.14);
            box-shadow:
              0 4px 32px rgba(13, 43, 15, 0.16),
              0 1px 4px rgba(13, 43, 15, 0.08);
            text-decoration: none;
            transition:
              transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.5s,
              border-color 0.3s;
          "
          onmouseenter="
            this.style.transform = 'translateY(-10px) scale(1.015)'
            this.style.boxShadow = '0 28px 64px rgba(13,43,15,0.26),0 8px 20px rgba(13,43,15,0.12)'
            this.style.borderColor = 'rgba(249,168,37,0.38)'
          "
          onmouseleave="
            this.style.transform = 'translateY(0) scale(1)'
            this.style.boxShadow = '0 4px 32px rgba(13,43,15,0.16),0 1px 4px rgba(13,43,15,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.14)'
          "
        >
          <div class="relative overflow-hidden" style="height: 270px; flex-shrink: 0">
            <img
              :src="updateImage4"
              alt="AVR"
              class="w-full h-full object-cover"
              style="transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              onmouseenter="this.style.transform = 'scale(1.08)'"
              onmouseleave="this.style.transform = 'scale(1)'"
            />
            <div
              class="absolute inset-0"
              style="
                background: linear-gradient(
                  to top,
                  rgba(13, 43, 15, 0.96) 0%,
                  rgba(13, 43, 15, 0.5) 40%,
                  rgba(13, 43, 15, 0.05) 75%,
                  transparent 100%
                );
              "
            ></div>
            <div
              class="absolute top-4 left-4 flex items-center gap-1.5"
              style="
                background: rgba(27, 94, 32, 0.88);
                backdrop-filter: blur(8px);
                padding: 4px 11px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span
                style="
                  font-size: 0.55rem;
                  font-weight: 800;
                  letter-spacing: 0.16em;
                  color: white;
                  text-transform: uppercase;
                "
                >Booking</span
              >
            </div>

            <div class="absolute bottom-4 left-5 right-5">
              <div style="margin-bottom: 10px">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(249,168,37,0.75)"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="14" x2="8" y2="14" stroke-width="2" />
                  <line x1="12" y1="14" x2="12" y2="14" stroke-width="2" />
                  <line x1="16" y1="14" x2="16" y2="14" stroke-width="2" />
                  <line x1="8" y1="18" x2="8" y2="18" stroke-width="2" />
                  <line x1="12" y1="18" x2="12" y2="18" stroke-width="2" />
                </svg>
              </div>
              <h3
                style="
                  font-size: 1.3rem;
                  font-weight: 900;
                  color: white;
                  line-height: 1.2;
                  letter-spacing: -0.015em;
                  margin: 0;
                  transition: color 0.3s;
                "
              >
                AVR Reservation
              </h3>
            </div>
          </div>
          <div class="flex flex-col flex-1 px-5 py-4" style="background: #0d2b0f">
            <p
              style="
                font-size: 0.74rem;
                color: rgba(255, 255, 255, 0.4);
                line-height: 1.7;
                margin: 0 0 16px;
                flex: 1;
              "
            >
              Reserve the Audio-Visual Room for events, presentations, and official meetings.
            </p>
            <div
              class="flex items-center justify-between"
              style="padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.07)"
            >
              <span style="font-size: 0.62rem; color: rgba(255, 255, 255, 0.2); font-weight: 600"
                >February 19, 2026</span
              >
              <span
                class="flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
                style="
                  font-size: 0.7rem;
                  font-weight: 800;
                  color: rgba(249, 168, 37, 0.7);
                  letter-spacing: 0.04em;
                  transition:
                    gap 0.2s,
                    color 0.2s;
                "
                onmouseenter="this.style.color = '#f9a825'"
                onmouseleave="this.style.color = 'rgba(249,168,37,0.7)'"
              >
                Reserve now
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style="height: 3px; background: linear-gradient(to right, #1b5e20, #f9a825)"
          ></div>
        </RouterLink>

        <RouterLink
          :to="{ name: 'top-borrowers' }"
          class="sr-card group relative flex flex-col overflow-hidden"
          style="
            border-radius: 20px;
            background: #0d2b0f;
            border: 1px solid rgba(249, 168, 37, 0.28);
            box-shadow:
              0 4px 32px rgba(13, 43, 15, 0.2),
              0 0 0 1px rgba(249, 168, 37, 0.08),
              0 0 60px rgba(249, 168, 37, 0.04);
            text-decoration: none;
            transition:
              transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.5s,
              border-color 0.3s;
          "
          onmouseenter="
            this.style.transform = 'translateY(-12px) scale(1.018)'
            this.style.boxShadow =
              '0 32px 72px rgba(13,43,15,0.3),0 0 0 1px rgba(249,168,37,0.5),0 0 60px rgba(249,168,37,0.1)'
            this.style.borderColor = 'rgba(249,168,37,0.55)'
          "
          onmouseleave="
            this.style.transform = 'translateY(0) scale(1)'
            this.style.boxShadow =
              '0 4px 32px rgba(13,43,15,0.2),0 0 0 1px rgba(249,168,37,0.08),0 0 60px rgba(249,168,37,0.04)'
            this.style.borderColor = 'rgba(249,168,37,0.28)'
          "
        >
          <div class="relative overflow-hidden" style="height: 270px; flex-shrink: 0">
            <img
              :src="updateImage5"
              alt="Top Borrowers"
              class="w-full h-full object-cover"
              style="transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              onmouseenter="this.style.transform = 'scale(1.08)'"
              onmouseleave="this.style.transform = 'scale(1)'"
            />
            <div
              class="absolute inset-0"
              style="
                background: linear-gradient(
                  to top,
                  rgba(13, 43, 15, 0.96) 0%,
                  rgba(13, 43, 15, 0.45) 40%,
                  rgba(120, 70, 0, 0.06) 75%,
                  transparent 100%
                );
              "
            ></div>
            <div
              class="absolute top-4 left-4 flex items-center gap-1.5"
              style="background: rgba(249, 168, 37, 0.92); padding: 4px 11px; border-radius: 20px"
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d2b0f"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span
                style="
                  font-size: 0.55rem;
                  font-weight: 800;
                  letter-spacing: 0.16em;
                  color: #0d2b0f;
                  text-transform: uppercase;
                "
                >Recognition</span
              >
            </div>

            <div class="absolute bottom-4 left-5 right-5">
              <div style="margin-bottom: 10px">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(249,168,37,0.85)"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M8 21h8M12 17v4" />
                  <path d="M5 3h14v6a7 7 0 01-14 0V3z" />
                  <path d="M5 7H2a2 2 0 000 4c.93 0 1.74-.63 2-1.5" />
                  <path d="M19 7h3a2 2 0 010 4c-.93 0-1.74-.63-2-1.5" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
              </div>
              <h3
                style="
                  font-size: 1.3rem;
                  font-weight: 900;
                  color: white;
                  line-height: 1.2;
                  letter-spacing: -0.015em;
                  margin: 0;
                "
              >
                Top Library Borrowers
              </h3>
            </div>
          </div>
          <div class="flex flex-col flex-1 px-5 py-4" style="background: #0d2b0f">
            <p
              style="
                font-size: 0.74rem;
                color: rgba(255, 255, 255, 0.4);
                line-height: 1.7;
                margin: 0 0 16px;
                flex: 1;
              "
            >
              Celebrating our most active readers and frequent library visitors each semester.
            </p>
            <div
              class="flex items-center justify-between"
              style="padding-top: 12px; border-top: 1px solid rgba(249, 168, 37, 0.1)"
            >
              <span style="font-size: 0.62rem; color: rgba(255, 255, 255, 0.2); font-weight: 600"
                >February 19, 2026</span
              >
              <span
                class="flex items-center gap-1.5"
                style="
                  font-size: 0.7rem;
                  font-weight: 800;
                  color: #f9a825;
                  letter-spacing: 0.04em;
                  transition: color 0.2s;
                "
                onmouseenter="this.style.color = '#fde68a'"
                onmouseleave="this.style.color = '#f9a825'"
              >
                View honorees
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style="height: 3px; background: linear-gradient(to right, #f9a825, #fde68a, #f9a825)"
          ></div>
        </RouterLink>

        <RouterLink
          :to="{ name: 'newlyacquiredbooks' }"
          class="sr-card group relative flex flex-col overflow-hidden"
          style="
            border-radius: 20px;
            background: #0d2b0f;
            border: 1px solid rgba(249, 168, 37, 0.14);
            box-shadow:
              0 4px 32px rgba(13, 43, 15, 0.16),
              0 1px 4px rgba(13, 43, 15, 0.08);
            text-decoration: none;
            transition:
              transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.5s,
              border-color 0.3s;
          "
          onmouseenter="
            this.style.transform = 'translateY(-10px) scale(1.015)'
            this.style.boxShadow = '0 28px 64px rgba(13,43,15,0.26),0 8px 20px rgba(13,43,15,0.12)'
            this.style.borderColor = 'rgba(249,168,37,0.38)'
          "
          onmouseleave="
            this.style.transform = 'translateY(0) scale(1)'
            this.style.boxShadow = '0 4px 32px rgba(13,43,15,0.16),0 1px 4px rgba(13,43,15,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.14)'
          "
        >
          <div class="relative overflow-hidden" style="height: 270px; flex-shrink: 0">
            <img
              :src="updateImage6"
              alt="Newly Acquired"
              class="w-full h-full object-cover"
              style="transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              onmouseenter="this.style.transform = 'scale(1.08)'"
              onmouseleave="this.style.transform = 'scale(1)'"
            />
            <div
              class="absolute inset-0"
              style="
                background: linear-gradient(
                  to top,
                  rgba(13, 43, 15, 0.96) 0%,
                  rgba(13, 43, 15, 0.5) 40%,
                  rgba(13, 43, 15, 0.05) 75%,
                  transparent 100%
                );
              "
            ></div>
            <div
              class="absolute top-4 left-4 flex items-center gap-1.5"
              style="
                background: rgba(27, 94, 32, 0.88);
                backdrop-filter: blur(8px);
                padding: 4px 11px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
              <span
                style="
                  font-size: 0.55rem;
                  font-weight: 800;
                  letter-spacing: 0.16em;
                  color: white;
                  text-transform: uppercase;
                "
                >New Arrivals</span
              >
            </div>

            <div class="absolute bottom-4 left-5 right-5">
              <div style="margin-bottom: 10px">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(249,168,37,0.75)"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                  <line x1="9" y1="15" x2="12" y2="15" />
                </svg>
              </div>
              <h3
                style="
                  font-size: 1.3rem;
                  font-weight: 900;
                  color: white;
                  line-height: 1.2;
                  letter-spacing: -0.015em;
                  margin: 0;
                "
              >
                Newly Acquired Books
              </h3>
            </div>
          </div>
          <div class="flex flex-col flex-1 px-5 py-4" style="background: #0d2b0f">
            <p
              style="
                font-size: 0.74rem;
                color: rgba(255, 255, 255, 0.4);
                line-height: 1.7;
                margin: 0 0 16px;
                flex: 1;
              "
            >
              Discover the latest additions to our growing collection of books and references.
            </p>
            <div
              class="flex items-center justify-between"
              style="padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.07)"
            >
              <span style="font-size: 0.62rem; color: rgba(255, 255, 255, 0.2); font-weight: 600"
                >February 19, 2026</span
              >
              <span
                class="flex items-center gap-1.5"
                style="
                  font-size: 0.7rem;
                  font-weight: 800;
                  color: rgba(249, 168, 37, 0.7);
                  letter-spacing: 0.04em;
                  transition: color 0.2s;
                "
                onmouseenter="this.style.color = '#f9a825'"
                onmouseleave="this.style.color = 'rgba(249,168,37,0.7)'"
              >
                Browse collection
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style="height: 3px; background: linear-gradient(to right, #1b5e20, #f9a825)"
          ></div>
        </RouterLink>
      </div>
    </div>
  </div>
  -->
  <!-- END LIBRARY SERVICES & RECOGNITION -->

  <!-- LIBRARY UPDATES -->
  <div class="w-full px-6 py-16" style="background: #f4f6f4">
    <div class="w-[100%] mx-auto">
      <div class="sr-item flex flex-col items-center mb-12 gap-3 text-center">
        <div class="flex items-center gap-3">
          <div style="width: 32px; height: 3px; background: #f9dc07; border-radius: 2px"></div>
          <span
            style="
              font-size: 0.68rem;
              font-weight: 800;
              letter-spacing: 0.25em;
              color: #003300;
              text-transform: uppercase;
            "
            >Latest from the Library</span
          >
        </div>
        <h2
          style="
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900;
            color: #003300;
            line-height: 1;
            letter-spacing: -0.02em;
            text-align: center;
          "
        >
          Library Updates
        </h2>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isAnnouncementsLoading" class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          v-for="n in 3"
          :key="n"
          class="rounded-2xl overflow-hidden"
          style="background: white; box-shadow: 0 2px 16px rgba(13, 43, 15, 0.08)"
        >
          <div class="animate-pulse">
            <div style="height: 220px; background: #e8efe8"></div>
            <div class="p-5">
              <div
                style="height: 14px; background: #e8efe8; border-radius: 4px; margin-bottom: 8px"
              ></div>
              <div style="height: 14px; background: #e8efe8; border-radius: 4px; width: 60%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic announcements from Supabase -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RouterLink
          v-for="(announcement, index) in latestAnnouncements"
          :key="announcement.id"
          :to="getAnnouncementRoute(announcement)"
          class="sr-card group block relative overflow-hidden rounded-2xl"
          :style="`box-shadow: 0 2px 16px rgba(13, 43, 15, 0.08); background: white; transition-delay: ${index * 0.08}s`"
        >
          <div class="relative overflow-hidden" style="height: 220px">
            <img
              :src="announcement.image_url ?? undefined"
              :alt="announcement.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              class="absolute inset-0"
              style="background: linear-gradient(to top, rgba(13, 43, 15, 0.7) 0%, transparent 60%)"
            ></div>
          </div>
          <div class="p-5">
            <h3
              style="font-size: 0.95rem; font-weight: 800; color: #003300; line-height: 1.4"
              class="mb-3"
            >
              {{ announcement.title }}
            </h3>
            <div class="flex items-center justify-between">
              <span style="font-size: 0.72rem; color: #aaa; font-weight: 600">{{
                formatAnnouncementDate(announcement.created_at)
              }}</span>
              <span
                class="flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                style="font-size: 0.75rem; font-weight: 700; color: #003300"
                >Read more
                <svg
                  style="width: 12px; height: 12px"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  /></svg
              ></span>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style="background: linear-gradient(to right, #1b5e20, #f9dc07)"
          ></div>
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- USEFUL LINKS -->
  <div
    class="w-[100%] px-6 py-16"
    style="background: #003300; position: relative; overflow: hidden"
  >
    <div
      class="absolute pointer-events-none"
      style="
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 1px solid rgba(249, 168, 37, 0.06);
        top: -200px;
        right: -150px;
      "
    ></div>
    <div
      class="absolute pointer-events-none"
      style="
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 1px solid rgba(249, 168, 37, 0.06);
        bottom: -100px;
        left: -80px;
      "
    ></div>
    <div class="w-[100%] mx-auto relative z-10">
      <div class="sr-item flex flex-col items-center mb-12 gap-3 text-center">
        <div class="flex items-center gap-3">
          <div style="width: 32px; height: 3px; background: #f9dc07; border-radius: 2px"></div>
          <span
            style="
              font-size: 0.68rem;
              font-weight: 800;
              letter-spacing: 0.25em;
              color: #f9dc07;
              text-transform: uppercase;
            "
            >External Resources</span
          >
        </div>
        <h2
          style="
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900;
            color: white;
            line-height: 1;
            letter-spacing: -0.02em;
            text-align: center;
          "
        >
          Useful Links
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          :href="usefulLink1"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08)"
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage1" alt="E-Lib" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              National Library
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              Philippine E-Lib
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              National Library of the Philippines (NLP)
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
        <a
          :href="usefulLink2"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition-delay: 0.08s;
          "
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage2" alt="CARSU" class="w-14 h-14 object-contain" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              University
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              CARSU Webpage
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              Caraga State University
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
        <a
          :href="usefulLink3"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08)"
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage3" alt="OPAC" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              Catalog
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              Web OPAC
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              Online Public Access Catalog
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
        <a
          :href="usefulLink4"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition-delay: 0.08s;
          "
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage4" alt="Free Journals" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              Open Access
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              Free Access Journals
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              Chicago University Press Publications
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
        <a
          :href="usefulLink5"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08)"
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage5" alt="Infotrac" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              Database
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              Infotrac
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              Online Custom Journals via Gale
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
        <a
          :href="usefulLink6"
          target="_blank"
          rel="noopener noreferrer"
          class="sr-card group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
          style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition-delay: 0.08s;
          "
          onmouseenter="
            this.style.background = 'rgba(249,168,37,0.08)'
            this.style.borderColor = 'rgba(249,168,37,0.3)'
          "
          onmouseleave="
            this.style.background = 'rgba(255,255,255,0.05)'
            this.style.borderColor = 'rgba(255,255,255,0.08)'
          "
        >
          <div
            class="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
            style="width: 72px; height: 72px; background: white"
          >
            <img :src="usefulImage6" alt="EBSCO" class="w-full h-full object-contain p-1" />
          </div>
          <div class="flex-1 min-w-0">
            <p
              style="
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                color: #f9dc07;
                text-transform: uppercase;
                margin-bottom: 2px;
              "
            >
              Database
            </p>
            <h3
              style="font-size: 1rem; font-weight: 800; color: white; line-height: 1.3"
              class="mb-1"
            >
              EBSCO
            </h3>
            <p style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.45)">
              Research Databases, eBooks & Discovery
            </p>
          </div>
          <div
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              style="width: 18px; height: 18px; color: #f9dc07"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- WATCH & EXPLORE -->
  <div class="w-full py-16 px-6" style="background: #f4f6f4">
    <div class="w-[100%] mx-auto">
      <div class="sr-item flex flex-col items-center mb-12 gap-3 text-center">
        <div class="flex items-center gap-3">
          <div style="width: 32px; height: 3px; background: #f9dc07; border-radius: 2px"></div>
          <span
            style="
              font-size: 0.68rem;
              font-weight: 800;
              letter-spacing: 0.25em;
              color: #003300;
              text-transform: uppercase;
            "
            >Featured Media</span
          >
        </div>
        <h2
          style="
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900;
            color: #003300;
            line-height: 1;
            letter-spacing: -0.02em;
            text-align: center;
          "
        >
          Watch &amp; Explore
        </h2>
      </div>

      <div
        v-if="displayFeatureItems.length"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        <div
          v-for="(feature, index) in displayFeatureItems"
          :key="feature.id"
          class="sr-card group relative rounded-2xl overflow-hidden cursor-pointer"
          style="box-shadow: 0 4px 32px rgba(13, 43, 15, 0.12)"
          @click="openFeature(index)"
        >
          <div class="relative overflow-hidden" style="aspect-ratio: 16/9">
            <template v-if="feature.type === 'video'">
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                :style="{ backgroundImage: `url('${getFeatureThumbnail(feature)}')` }"
              ></div>
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 35%)"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                  style="
                    width: 68px;
                    height: 68px;
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(6px);
                  "
                >
                  <svg
                    class="w-7 h-7 text-white"
                    style="margin-left: 5px"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div
                class="absolute bottom-4 left-4 flex items-center gap-1.5"
                style="
                  background: rgba(0, 0, 0, 0.55);
                  padding: 4px 10px;
                  border-radius: 6px;
                  backdrop-filter: blur(4px);
                "
              >
                <svg class="w-3.5 h-3.5" fill="#FF0000" viewBox="0 0 24 24">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
                <span style="font-size: 0.7rem; color: white; font-weight: 600"
                  >Watch on YouTube</span
                >
              </div>
            </template>
            <template v-else>
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                :style="{ backgroundImage: `url('${feature.src}')` }"
              ></div>
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, transparent 35%)"
              ></div>
            </template>
          </div>
          <div class="p-6" style="background: #003300">
            <h3
              style="font-size: 1.25rem; font-weight: 900; color: white; line-height: 1.2"
              class="mb-2"
            >
              {{ feature.title }}
            </h3>
            <p style="font-size: 0.82rem; color: rgba(255, 255, 255, 0.5); line-height: 1.65">
              {{ getFeatureDescription(feature, index) }}
            </p>
            <div
              class="mt-5 pt-4 flex items-center gap-2"
              style="border-top: 1px solid rgba(255, 255, 255, 0.07)"
            >
              <div style="width: 20px; height: 2px; background: #f9dc07; border-radius: 2px"></div>
              <span
                style="
                  font-size: 0.65rem;
                  font-weight: 700;
                  color: rgba(255, 255, 255, 0.3);
                  letter-spacing: 0.1em;
                  text-transform: uppercase;
                "
                >Caraga State University Library</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FEATURE MODAL -->
  <div
    v-if="activeFeatureModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    @click.self="closeFeatureModal"
  >
    <div
      class="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
    >
      <button
        @click="closeFeatureModal"
        class="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/20"
        style="
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
        "
      >
        ✕
      </button>
      <iframe
        v-if="activeFeatureModal.type === 'video' && activeFeatureModal.embedUrl"
        class="w-full h-full"
        :src="`${activeFeatureModal.embedUrl}?autoplay=1`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <video
        v-else-if="activeFeatureModal.type === 'video'"
        class="w-full h-full"
        :src="activeFeatureModal.src"
        controls
        autoplay
      ></video>
      <img
        v-else
        class="w-full h-full object-contain bg-black"
        :src="activeFeatureModal.src"
        :alt="activeFeatureModal.title"
      />
    </div>
  </div>

  <!-- SCROLL TO TOP -->
  <Transition name="fade">
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:opacity-90"
      style="background: #003300"
    >
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getImagesByPage } from '@/services/websiteImageService'
import { supabase } from '@/lib/supabase'

import photo1 from '@/assets/images/img.jpg'
import photo2 from '@/assets/images/lib.jpg'
import photo3 from '@/assets/images/img1.jpg'
import photo4 from '@/assets/images/img2.jpg'
import photo5 from '@/assets/images/img3.jpg'
import designBg from '@/assets/images/design.png'
import card1 from '@/assets/images/card1.jpg'
import card2 from '@/assets/images/card2.jpg'
import card3 from '@/assets/images/card3.png'
import reservation from '@/assets/images/reservation.jpg'
import topImg from '@/assets/images/top.jpg'
import newlyAcquiredBooks from '@/assets/images/newly_acc_books.png'
import eLib from '@/assets/images/e-lib.jpg'
import opac from '@/assets/images/opac.png'
import freeJournals from '@/assets/images/free.jpg'
import gale from '@/assets/images/gale.jpg'
import ebsco from '@/assets/images/EBSCO.jpg'

type MediaType = 'image' | 'video'
type PageType = 'homepage' | 'aboutpage'
type MediaItem = {
  id: string
  title: string
  type: MediaType
  page: PageType
  section: string
  order: number
  category: string
  src: string
  externalLink?: string
  embedUrl?: string
  thumbnail?: string
}
type CarouselDisplayItem = { id: string; type: MediaType; src: string; alt: string }

type AnnouncementRow = {
  id: string
  type: string | null
  title: string
  image_url: string | null
  created_at: string
}

// Map announcement title keywords to their fixed route names
function getAnnouncementRoute(announcement: AnnouncementRow): { name: string } {
  const title = announcement.title.toLowerCase()
  if (title.includes('bsp') || title.includes('bangko sentral')) return { name: 'bcppage' }
  if (title.includes('national book week') || title.includes('nbwc')) return { name: 'nbwcpage' }
  if (title.includes('starbooks') || title.includes('dost')) return { name: 'starbooks' }
  // Fallback: return bcppage if unknown
  return { name: 'bcppage' }
}

function formatAnnouncementDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const latestAnnouncements = ref<AnnouncementRow[]>([])
const isAnnouncementsLoading = ref(true)

async function loadAnnouncements() {
  isAnnouncementsLoading.value = true
  try {
    // Fetch latest 3 unique news announcements (distinct by title, latest first)
    const { data, error } = await supabase
      .from('announcements')
      .select('id, type, title, image_url, created_at')
      .eq('type', 'news')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Deduplicate by title — keep only the latest per title
    const seen = new Set<string>()
    const unique: AnnouncementRow[] = []
    for (const row of data ?? []) {
      const key = row.title.trim().toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(row)
      }
      if (unique.length === 3) break
    }
    latestAnnouncements.value = unique
  } catch (error) {
    console.error('Failed to load announcements:', error)
    latestAnnouncements.value = []
  } finally {
    isAnnouncementsLoading.value = false
  }
}

const STORAGE_KEY = 'website-media-v11'
const isMediaLoaded = ref(false)

const defaultImages: CarouselDisplayItem[] = [
  { id: 'default-1', type: 'image', src: photo1, alt: 'Photo 1' },
  { id: 'default-2', type: 'image', src: photo2, alt: 'Photo 2' },
  { id: 'default-3', type: 'image', src: photo3, alt: 'Photo 3' },
  { id: 'default-4', type: 'image', src: photo4, alt: 'Photo 4' },
  { id: 'default-5', type: 'image', src: photo5, alt: 'Photo 5' },
]

const mediaItems = ref<MediaItem[]>([])

function extractYouTubeId(url: string) {
  if (!url) return ''
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&/]+)/,
    /(?:youtube\.com\/embed\/)([^?&/]+)/,
    /(?:youtube\.com\/shorts\/)([^?&/]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return ''
}

function getYouTubeThumbnail(url: string) {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

function getYouTubeEmbed(url: string) {
  const id = extractYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : ''
}

function normalizeMediaRow(row: any): MediaItem {
  const mediaType = (row.media_type || 'image') as MediaType
  const videoUrl = row.video_url || row.external_link || ''
  const imageUrl = row.image_url || ''
  const thumbnailUrl = row.thumbnail_url || imageUrl || getYouTubeThumbnail(videoUrl)

  return {
    id: row.id,
    title: row.title || '',
    type: mediaType,
    page: row.page || 'homepage',
    section: row.section || '',
    order: Number(row.display_order || 1),
    category: `HomePage ${row.section || ''}`,
    src: mediaType === 'video' ? videoUrl : imageUrl,
    externalLink: row.external_link || '',
    embedUrl: mediaType === 'video' ? getYouTubeEmbed(videoUrl) : '',
    thumbnail: mediaType === 'video' ? thumbnailUrl : imageUrl,
  }
}

function loadMediaFromLocalStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    mediaItems.value = Array.isArray(raw) ? raw : []
  } catch {
    mediaItems.value = []
  }
}

async function loadMediaFromSupabase() {
  isMediaLoaded.value = false
  try {
    const rows = await getImagesByPage('homepage')
    mediaItems.value = rows.map(normalizeMediaRow)
  } catch (error) {
    console.error('Failed to load homepage media from Supabase:', error)
    loadMediaFromLocalStorage()
  } finally {
    isMediaLoaded.value = true
  }
}

function getSectionMedia(section: string) {
  return mediaItems.value
    .filter((item) => item.page === 'homepage' && item.section === section)
    .sort((a, b) => a.order - b.order)
}

const carouselItems = computed<CarouselDisplayItem[]>(() => {
  if (!isMediaLoaded.value) return []

  const items = getSectionMedia('carousel')
  if (!items.length) return defaultImages

  return items.map((item) => ({
    id: item.id,
    type: item.type,
    src: item.src,
    alt: item.title || 'Carousel Media',
  }))
})

const librarySectionItems = computed(() => getSectionMedia('library-section'))
const rldItems = computed(() => getSectionMedia('read-learn-discover'))
const updateItems = computed(() => getSectionMedia('library-updates'))
const usefulItems = computed(() => getSectionMedia('useful-links'))
const featureItems = computed(() => getSectionMedia('features'))

const libraryBgImage = computed(() => librarySectionItems.value[0]?.src || designBg)
const libraryMainImage = computed(() => librarySectionItems.value[1]?.src || photo2)

const rldImage1 = computed(() => rldItems.value[0]?.src || '')
const rldImage2 = computed(() => rldItems.value[1]?.src || '')
const rldImage3 = computed(() => rldItems.value[2]?.src || '')

const updateImage1 = computed(() => updateItems.value[0]?.src || card1)
const updateImage2 = computed(() => updateItems.value[1]?.src || card2)
const updateImage3 = computed(() => updateItems.value[2]?.src || card3)
const updateImage4 = computed(() => updateItems.value[3]?.src || reservation)
const updateImage5 = computed(() => updateItems.value[4]?.src || topImg)
const updateImage6 = computed(() => updateItems.value[5]?.src || newlyAcquiredBooks)

const usefulImage1 = computed(() => usefulItems.value[0]?.src || eLib)
const usefulImage2 = computed(() => usefulItems.value[1]?.src || '/csu-logo.png')
const usefulImage3 = computed(() => usefulItems.value[2]?.src || opac)
const usefulImage4 = computed(() => usefulItems.value[3]?.src || freeJournals)
const usefulImage5 = computed(() => usefulItems.value[4]?.src || gale)
const usefulImage6 = computed(() => usefulItems.value[5]?.src || ebsco)

const usefulLink1 = computed(() => usefulItems.value[0]?.externalLink || 'https://www.elib.gov.ph')
const usefulLink2 = computed(
  () => usefulItems.value[1]?.externalLink || 'https://www.carsu.edu.ph/',
)
const usefulLink3 = computed(
  () => usefulItems.value[2]?.externalLink || 'http://mylibrary.carsu.edu.ph/',
)
const usefulLink4 = computed(
  () =>
    usefulItems.value[3]?.externalLink ||
    'https://www.journals.uchicago.edu/action/showPublications',
)
const usefulLink5 = computed(
  () =>
    usefulItems.value[4]?.externalLink ||
    'https://link.gale.com/apps/menu?userGroupName=phcarsu&prodId=MENU',
)
const usefulLink6 = computed(() => usefulItems.value[5]?.externalLink || 'https://login.ebsco.com')

const defaultFeatureItems: MediaItem[] = [
  {
    id: 'default-feature-1',
    title: 'Virtual Tour',
    type: 'video',
    page: 'homepage',
    section: 'features',
    order: 1,
    category: 'HomePage Features',
    src: 'https://www.youtube.com/watch?v=Lv0URTSBniY',
    thumbnail: 'https://img.youtube.com/vi/Lv0URTSBniY/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/Lv0URTSBniY',
    externalLink: 'https://www.youtube.com/watch?v=Lv0URTSBniY',
  },
  {
    id: 'default-feature-2',
    title: 'Library Orientation',
    type: 'video',
    page: 'homepage',
    section: 'features',
    order: 2,
    category: 'HomePage Features',
    src: 'https://www.youtube.com/watch?v=HAEPrH2aYpc',
    thumbnail: 'https://img.youtube.com/vi/HAEPrH2aYpc/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/HAEPrH2aYpc',
    externalLink: 'https://www.youtube.com/watch?v=HAEPrH2aYpc',
  },
]

const displayFeatureItems = computed(() =>
  featureItems.value.length ? featureItems.value : defaultFeatureItems,
)

const activeFeatureModal = ref<MediaItem | null>(null)

function getFeatureThumbnail(feature: MediaItem) {
  return feature.thumbnail || getYouTubeThumbnail(feature.src) || feature.src
}

function getFeatureDescription(feature: MediaItem, index: number) {
  if (feature.type === 'video') {
    if (index === 0)
      return 'Explore our modern facilities and collection areas from the comfort of your device.'
    if (index === 1)
      return 'First time here? Learn how to navigate our physical and digital resources before your visit.'
    return 'Watch and explore more featured videos from Caraga State University Library.'
  }
  return index === 0
    ? 'Preview one of the featured visual highlights of Caraga State University Library.'
    : 'Another featured visual from the library that can be opened in a larger preview.'
}

function openFeature(index: number) {
  activeFeatureModal.value = displayFeatureItems.value[index] || null
}

function closeFeatureModal() {
  activeFeatureModal.value = null
}

const imageHeight = '600px'
const currentIndex = ref(0)
const slideWidth = 100
const showScrollTop = ref(false)

let autoplayInterval: ReturnType<typeof setInterval> | null = null
let observer: IntersectionObserver | null = null

function next() {
  if (!carouselItems.value.length) return
  currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length
}

function prev() {
  if (!carouselItems.value.length) return
  currentIndex.value =
    (currentIndex.value - 1 + carouselItems.value.length) % carouselItems.value.length
}

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function initObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view')
        else entry.target.classList.remove('in-view')
      })
    },
    { threshold: 0.1 },
  )
  document
    .querySelectorAll('.sr-item, .sr-card, .sr-left, .sr-right')
    .forEach((el) => observer?.observe(el))
}

async function handleMediaUpdated() {
  await loadMediaFromSupabase()
  if (currentIndex.value >= carouselItems.value.length) currentIndex.value = 0
}

onMounted(async () => {
  await Promise.all([loadMediaFromSupabase(), loadAnnouncements()])
  autoplayInterval = setInterval(next, 3000)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('website-media-updated', handleMediaUpdated as EventListener)
  setTimeout(initObserver, 100)
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
  if (observer) observer.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('website-media-updated', handleMediaUpdated as EventListener)
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}
.sr-item,
.sr-card {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.sr-left {
  opacity: 0;
  transform: translateX(-48px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}
.sr-right {
  opacity: 0;
  transform: translateX(48px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}
.sr-item.in-view,
.sr-card.in-view,
.sr-left.in-view,
.sr-right.in-view {
  opacity: 1;
  transform: translate(0, 0);
}
@media (max-width: 768px) {
  .tagline-title {
    margin-top: 22px;
    margin-bottom: 14px;
    font-size: 1.5rem;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
