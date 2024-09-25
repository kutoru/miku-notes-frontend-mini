<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$components/Button.svelte";
  import type { Shelf } from "$types/shelf";
  import { shelfGet } from "$lib/api";
  import { formatDate, formatSize } from "$lib/util";
  import FloatingButton from "$components/FloatingButton.svelte";
  import Upload from "$components/icons/Upload.svelte";
  import Copy from "$components/icons/Copy.svelte";
  import FileCard from "$components/FileCard.svelte";

  let shelf: Shelf | undefined;
  $: disabled = !shelf;
  let text = "";
  $: if (shelf) {
    text = shelf.text;
  } else {
    text = "";
  }

  function onTextChange(e: any) {
    text = e.target.value;
  }

  onMount(() => {
    load();
  });

  function save() {
    console.log("save");
  }

  async function load() {
    shelf = undefined;

    const loadedShelf = await shelfGet();
    if (!loadedShelf) {
      console.log("Could not load the shelf");
      return;
    }
    loadedShelf.files = [
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 1,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 2,
        name: "long filename with spaces-anddashes.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 3,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 4,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 5,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 6,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 7,
        name: "filenamefilenamefilenamefilenamefilenamefilenamefilenamefilenamefilenamefilenamefilenamefilename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 8,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
      {
        created: loadedShelf.created,
        hash: "aoaoaoaoao342343",
        id: 9,
        name: "filename.png",
        size: 9238959,
        user_id: 1,
      },
    ];
    // loadedShelf.files = [];

    shelf = loadedShelf;
  }

  function convertToNote() {
    console.log("convertToNote");
  }

  function clear() {
    console.log("clear");
  }

  function copyToClipboard() {
    console.log("copyToClipboard");
  }

  function uploadFile() {
    console.log("uploadFile");
  }

  async function deleteFile(fileId: number) {
    console.log("deleteFile", fileId);
  }

  async function downloadFile(fileHash: string) {
    console.log("downloadFile", fileHash);
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex cursor-default">
    <div class="flex-none">
      Last edited: {!shelf ? "-" : formatDate(shelf.last_edited)}
    </div>
    <div class="flex-1" />
    <div class="flex-none">
      Times edited: {!shelf ? "-" : shelf.times_edited}
    </div>
  </div>

  <div class="w-100 h-1 rounded-full bg-gray-950 my-2 flex-none md:my-4" />

  <div
    class="flex-1 basis-3/5 relative rounded-md border-2 border-gray-950 bg-[#00000050] min-h-32"
  >
    <FloatingButton
      {disabled}
      onclick={copyToClipboard}
      class="right-0 bottom-0 absolute mb-1 me-1 md:mb-2 md:me-2"
      iconPath={Copy}
    />
    {#if disabled}
      <div class="size-full flex">
        <div class="m-auto size-fit cursor-default italic text-gray-400">
          Shelf not loaded
        </div>
      </div>
    {:else}
      <textarea
        value={text}
        on:input={onTextChange}
        class={"rounded-md p-1 size-full bg-transparent pb-14 md:pb-16 " +
          "text-inherit outline-none resize-none"}
        style="scrollbar-width: thin;"
      />
    {/if}
  </div>

  <div class="w-100 h-1 rounded-full bg-gray-950 my-2 flex-none md:my-4" />

  <div
    class="min-h-32 flex-1 basis-2/5 rounded-md border-2 border-gray-950 bg-[#00000050] flex relative cursor-default"
  >
    <FloatingButton
      {disabled}
      onclick={uploadFile}
      class="right-0 bottom-0 absolute mb-1 me-1 md:mb-2 md:me-2"
      iconPath={Upload}
    />
    {#if !shelf || !shelf.files.length}
      <div class="m-auto size-fit cursor-default italic text-gray-400">
        No files
      </div>
    {:else}
      <div class="w-full h-full overflow-y-auto" style="scrollbar-width: thin;">
        <div
          class={"w-full grid grid-flow-row gap-1 overflow-y-auto " +
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-2 p-1 md:p-2 pb-14 md:pb-16"}
        >
          {#each shelf.files as file (file.id)}
            <FileCard {file} onDelete={deleteFile} onDownload={downloadFile} />
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="w-100 h-1 rounded-full bg-gray-950 my-2 flex-none md:my-4" />

  <div class="flex gap-2 md:gap-4">
    <Button onclick={load} class="flex-1">Refresh</Button>
    <Button {disabled} onclick={clear} class="flex-1">Clear</Button>
    <Button {disabled} onclick={convertToNote} class="flex-1">To note</Button>
    <Button {disabled} onclick={save} class="flex-1">Save</Button>
  </div>
</div>
