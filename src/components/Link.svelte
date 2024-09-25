<script lang="ts">
  export let href;
</script>

<a
  {href}
  class="underline text-blue-400 hover:text-blue-500 active:text-blue-600"
>
  <slot />
</a>
