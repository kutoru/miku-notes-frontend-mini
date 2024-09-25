<script lang="ts">
  import Svg from "./icons/Svg.svelte";

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
    <Svg
      svgPath={iconPath}
      class={"fill-white m-auto tran-main " +
        "group-hover/fb:fill-gray-300 group-active/fb:fill-gray-400 group-disabled/fb:fill-gray-400"}
    />
  {/if}

  <slot />
</button>
