<script lang="ts">
  let className = "";
  export { className as class };
  export let svgPath;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -960 960 960"
  class={"size-6 " + className}
>
  <svelte:component this={svgPath} />
</svg>
