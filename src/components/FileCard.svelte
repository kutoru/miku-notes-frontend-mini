<script lang="ts">
  import { formatSize, formatDate } from "$lib/util";
  import type { FileInfo } from "$types/file";
  import Svg from "$components/icons/Svg.svelte";
  import Trash from "$components/icons/Trash.svelte";
  import Download from "$components/icons/Download.svelte";

  export let file: FileInfo;
  export let onDelete: (fileId: number) => Promise<void>;
  export let onDownload: (fileHash: string) => Promise<void>;
</script>

<div
  class="rounded-md border-2 border-gray-950 h-fit text-center bg-[#e11d4721] text-sm md:text-base"
>
  <div class="flex">
    <button
      on:click={async () => await onDelete(file.id)}
      class={"flex-none border-b-2 border-gray-950 p-1 bg-transparent tran-main " +
        "group/btn hover:bg-[#00000020] active:bg-[#00000040] " +
        "border-e-2 rounded-ee-md"}
    >
      <Svg
        class={"fill-white mx-auto size-5 md:size-6 tran-main " +
          "group-hover/btn:fill-gray-300 group-active/btn:fill-gray-400"}
        svgPath={Trash}
      />
    </button>

    <div class="flex-1 flex">
      <span class="m-auto">
        {formatSize(file.size)}
      </span>
    </div>

    <button
      on:click={async () => await onDownload(file.hash)}
      class={"flex-none border-b-2 border-gray-950 p-1 bg-transparent tran-main " +
        "group/btn hover:bg-[#00000020] active:bg-[#00000040] " +
        "border-s-2 rounded-es-md"}
    >
      <Svg
        class={"fill-white mx-auto size-5 md:size-6 tran-main " +
          "group-hover/btn:fill-gray-300 group-active/btn:fill-gray-400"}
        svgPath={Download}
      />
    </button>
  </div>

  <div class="h-11 md:h-12 flex border-gray-950">
    <span
      class="break-words m-auto text-ellipsis line-clamp-2 max-h-full max-w-full"
      >{file.name}</span
    >
  </div>

  {formatDate(file.created)}
</div>
