<script lang="ts">
  export let shown: boolean;
  export let onConfirm: (() => Promise<boolean>) | undefined = undefined;
  export let onCancel: (() => Promise<void>) | undefined = undefined;

  async function cancel(e: MouseEvent) {
    if (document.activeElement !== e.target) {
      return;
    }

    if (onCancel) {
      await onCancel();
    }

    shown = false;
  }

  async function confirm() {
    let close = true;
    if (onConfirm) {
      close = await onConfirm();
    }

    if (close) {
      shown = false;
    }
  }
</script>

<button
  on:click|self={cancel}
  class={"top-0 absolute tran-main px-8 size-full left-0 flex bg-[#00000080] z-30 cursor-default " +
    (shown ? "" : "opacity-0 invisible")}
>
  <div class="bg-rose-800 rounded-md size-fit m-auto max-h-full max-w-full">
    <div class="select-text m-8">
      <slot />
    </div>

    <div class="flex border-t-2 border-gray-950">
      <button
        on:click={cancel}
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
