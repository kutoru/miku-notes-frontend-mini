<script lang="ts">
  import Cross from "./icons/Cross.svelte";
  import Svg from "./icons/Svg.svelte";

  export let lastShown = 0;
  export let duration = 3000;
  $: shown = lastShown + duration > Date.now();
  let lastTimeout: number | undefined = undefined;

  $: if (lastShown + duration > Date.now()) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(close, duration);
  }

  function close() {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastShown = 0;
    lastTimeout = undefined;
  }
</script>

<div
  class={"top-0 absolute tran-main px-2 pt-2 w-full left-0 flex pointer-events-none z-40 " +
    (shown ? "" : "-translate-y-12")}
>
  <div
    class="bg-rose-800 rounded-md size-fit mx-auto flex cursor-default pointer-events-auto max-w-full"
  >
    <span class="flex-1 m-auto p-2 text-ellipsis line-clamp-1">
      <slot />
    </span>

    <button
      on:click={close}
      class={"flex-none p-1.5 border-s-2 border-gray-950 tran-main " +
        "group/btn hover:bg-[#00000020] active:bg-[#00000040]"}
    >
      <Svg
        svgPath={Cross}
        class={"fill-white tran-main " +
          "group-hover/btn:fill-gray-300 group-active/btn:fill-gray-400"}
      />
    </button>
  </div>
</div>
