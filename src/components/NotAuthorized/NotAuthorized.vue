<template>
  <div class="tw-relative tw-bg-white tw-h-screen">
    <div
      class="tw-absolute tw-w-[410px] tw-left-2/4 tw-top-2/4 tw-translate-x-[-50%] tw-translate-y-[-50%] tw-text-center"
    >
      <div class="tw-h-[280px] tw-relative tw-z-[-1]">
        <h1
          class="tw-font-montserrat tw-absolute tw-text-[180px] tw-font-[900] tw-bg-center tw-text-transparent tw-bg-notfound tw-bg-clip-text tw-bg-cover tw-bg-no-repeat tw-my-[-50px] tw-left-2/4 tw-translate-x-[-50%]"
        >
          Forbidden
        </h1>
      </div>
      <h2
        class="tw-font-poppins tw-text-black tw-text-[24px] tw-uppercase tw-font-bold mb-5"
      >
        403 - Not Authorized
      </h2>
      <p class="tw-font-poppins tw-text-black tw-text-[14px] tw-mb-5">
        You do not have perrmision to access this page
      </p>
      <router-link
        class="tw-font-poppins tw-text-[14px] tw-font-bold tw-text-white tw-uppercase tw-bg-[#0046d5] tw-px-8 tw-py-4 tw-rounded-[40px]"
        to="/"
        >Go To Homepage</router-link
      >
    </div>
  </div>
</template>
<script setup></script>
