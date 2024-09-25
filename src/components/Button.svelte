<script lang="ts">
  let className = "";
  export { className as class };
  export let disabled = false;
  export let onclick: () => void;
</script>

<button
  on:click={onclick}
  {disabled}
  class={"rounded-md tran-main bg-rose-800 w-fit px-2.5 py-1.5 cursor-pointer select-none " +
    "hover:bg-rose-900 hover:text-gray-300 " +
    "active:bg-rose-950 active:text-gray-400 " +
    "disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-default " +
    className}
>
  <slot />
</button>
