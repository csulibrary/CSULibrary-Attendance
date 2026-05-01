<template>
  <footer class="w-full bg-[#05141c] text-slate-200 py-4 px-6 md:px-12 font-['Poppins',sans-serif]">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-6 w-[4px] bg-[#f9dc07] rounded-full"></div>
            <h2 class="text-xl font-black tracking-widest text-white uppercase">Library Hours</h2>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div
              class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <h3 class="font-bold text-[#f9dc07] text-[12px] uppercase mb-2 tracking-wider">
                Undergraduate
              </h3>
              <div class="space-y-2">
                <div>
                  <p class="text-[9px] text-slate-400 font-bold uppercase">Mon — Fri</p>
                  <p class="text-xs text-white">8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 font-bold uppercase">Saturday</p>
                  <p class="text-xs text-white">8:00 AM - 5:00 PM</p>
                </div>
                <p
                  class="text-[9px] italic text-[#f9dc07] bg-[#fbc02d]/10 py-0.5 px-2 rounded-md inline-block"
                >
                  No Noon Break
                </p>
              </div>
            </div>

            <div
              class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <h3 class="font-bold text-[#f9dc07] text-[12px] uppercase mb-2 tracking-wider">
                Graduate
              </h3>
              <div class="space-y-2">
                <div>
                  <p class="text-[9px] text-slate-400 font-bold uppercase">Mon — Fri</p>
                  <p class="text-xs text-white">8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 font-bold uppercase">Saturday</p>
                  <p class="text-xs text-white">8:00 AM - 5:00 PM</p>
                </div>
                <p
                  class="text-[9px] italic text-[#f9dc07] bg-[#fbc02d]/10 py-0.5 px-2 rounded-md inline-block"
                >
                  No Noon Break
                </p>
              </div>
            </div>
          </div>

          <!-- CSU Library Developers Button -->
          <button
            @click="$router.push('/developers')"
            class="mt-4 w-full py-2 px-4 rounded-xl border border-[#f9dc07]/30 bg-[#f9dc07] text-[#05141c] text-[11px] font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#f9dc07] transition-all"
          >
            CSU-Library Developers
          </button>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div class="h-6 w-[4px] bg-[#f9dc07] rounded-full"></div>
            <h2 class="text-xl font-black tracking-widest text-white uppercase">Contact Us</h2>
          </div>

          <div class="flex flex-col gap-1">
            <div
              class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#fbc02d]/50 transition-all group cursor-default"
            >
              <div class="p-2 bg-slate-800 rounded-lg group-hover:bg-[#f9dc07] transition-colors">
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                <p
                  class="text-xs text-white font-medium group-hover:text-[#fbc02d] transition-colors leading-tight"
                >
                  Caraga State University, Butuan City
                </p>
              </div>
            </div>

            <a
              href="mailto:csulibrary@carsu.edu.ph"
              class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#fbc02d]/50 transition-all group"
            >
              <div class="p-2 bg-slate-800 rounded-lg group-hover:bg-[#f9dc07] transition-colors">
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p
                  class="text-xs text-white font-medium group-hover:text-[#fbc02d] transition-colors"
                >
                  csulibrary@carsu.edu.ph
                </p>
              </div>
            </a>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <a
                href="#"
                class="flex items-center justify-center gap-2 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2] border border-[#1877F2]/20 rounded-xl transition-all group"
              >
                <svg class="w-4 h-4 fill-[#1877F2] group-hover:fill-white" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span class="text-[10px] font-bold text-white uppercase tracking-tighter"
                  >Facebook</span
                >
              </a>
              <a
                href="#"
                class="flex items-center justify-center gap-2 py-2 bg-[#00B2FF]/10 hover:bg-[#00B2FF] border border-[#00B2FF]/20 rounded-xl transition-all group"
              >
                <svg class="w-4 h-4 fill-[#00B2FF] group-hover:fill-white" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.298.474 3.443.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.393l-3.294-3.511-6.423 3.511 7.065-7.5 3.388 3.511 6.328-3.511-7.064 7.5z"
                  />
                </svg>
                <span class="text-[10px] font-bold text-white uppercase tracking-tighter"
                  >Messenger</span
                >
              </a>
            </div>
            <p
              class="pb-2 text-[9px] leading-tight text-center pl-13 pt-2 lg:text-left text-slate-500 italic mt-4"
            >
              "Come & visit us @ New Library Building near Harrison bridge"
            </p>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div class="h-6 w-[4px] bg-[#f9dc07] rounded-full"></div>
            <h2 class="text-xl font-black tracking-widest text-white uppercase">Find Us</h2>
          </div>
          <div
            class="flex-grow min-h-[150px] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-500/50 group relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.132205166258!2d125.5901111!3d8.9599528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3301eadf9d65123d%3A0xc3f58e65e4d293f0!2sCaraga%20State%20University!5e0!3m2!1sen!2sph!4v1700000000000"
              class="w-full h-full grayscale-[0.6] contrast-[1.2] group-hover:grayscale-0 transition-all duration-1000"
              style="border: 0"
              allowfullscreen="true"
              loading="lazy"
            ></iframe>
            <div
              class="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-2 border-t border-white/5 flex flex-col items-center justify-center">
        <p class="text-[10px] opacity-60">
          © 2026 <span class="text-white font-semibold">Caraga State University Library.</span>
        </p>
        <div
          class="flex items-center gap-3 bg-white/5 py-1 px-3 rounded-full border border-white/5 mt-2 scale-90"
        >
          <span class="text-[8px] uppercase tracking-widest text-slate-500">System by</span>
          <div class="h-2 w-[1px] bg-white/20"></div>
          <span class="text-[10px] text-white font-black">CSU E-LIBRARY</span>
        </div>
      </div>
    </div>
  </footer>
</template>
