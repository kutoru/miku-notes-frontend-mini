<script lang="ts">
  let className = "";
  export { className as class };
  export let disabled = false;
  export let onclick: () => void;
  export let iconPath: any = null;
</script>

<button
  on:click={onclick}
  {disabled}
  class={"group/fb bg-rose-800 tran-main rounded-full size-12 cursor-pointer select-none " +
    "hover:bg-rose-900 hover:text-gray-300 " +
    "active:bg-rose-950 active:text-gray-400 " +
    "disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-default " +
    className}
>
  {#if iconPath}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      class={"fill-white m-auto tran-main " +
        "group-hover/fb:fill-gray-300 group-active/fb:fill-gray-400 group-disabled/fb:fill-gray-400"}
    >
      <svelte:component this={iconPath} />
    </svg>
  {/if}

  <slot />
</button>
