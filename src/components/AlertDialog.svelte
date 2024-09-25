<script lang="ts">
  export let shown: boolean;
  export let onConfirm: (() => Promise<void>) | undefined = undefined;
  export let onClose: (() => Promise<void>) | undefined = undefined;

  async function close() {
    if (onClose) {
      await onClose();
    }

    shown = false;
  }

  async function confirm() {
    if (onConfirm) {
      await onConfirm();
    }

    shown = false;
  }
</script>

<button
  on:click|self={close}
  class={"top-0 absolute tran-main px-16 size-full left-0 flex bg-[#00000080] z-30 cursor-default " +
    (shown ? "" : "opacity-0 invisible")}
>
  <div class="bg-rose-800 rounded-md size-fit m-auto max-h-full max-w-full">
    <div class="select-text m-8">
      <slot />
    </div>

    <div class="flex border-t-2 border-gray-950">
      <button
        on:click={close}
        class={"flex-1 tran-main p-2 " +
          "hover:bg-[#00000020] active:bg-[#00000040]"}
      >
        Cancel
      </button>

      <button
        on:click={confirm}
        class={"flex-1 tran-main p-2 " +
          "hover:bg-[#00000020] active:bg-[#00000040]"}
      >
        OK
      </button>
    </div>
  </div>
</button>
