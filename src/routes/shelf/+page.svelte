<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$components/Button.svelte";
  import type { Shelf } from "$types/shelf";
  import {
    shelfGet,
    shelfPatch,
    shelfDelete,
    shelfToNotePost,
    filePost,
    fileDelete,
    fileGet,
  } from "$lib/api";
  import { formatDate } from "$lib/util";
  import FloatingButton from "$components/FloatingButton.svelte";
  import Upload from "$components/icons/Upload.svelte";
  import Copy from "$components/icons/Copy.svelte";
  import FileCard from "$components/FileCard.svelte";
  import Popup from "$components/Popup.svelte";
  import AlertDialog from "$components/AlertDialog.svelte";

  let shelf: Shelf | undefined;
  $: disabled = !shelf;
  let noteTitleText = "";
  let textElement: HTMLTextAreaElement;
  let shelfText = "";
  $: if (shelf) {
    shelfText = shelf.text;
  } else {
    shelfText = "";
  }

  let popupLastShown = 0;
  let popupMessage = "";
  let popupDuration = 3000;

  function showNotif(message: string, duration: number = 3000) {
    popupMessage = message;
    popupDuration = duration;
    popupLastShown = Date.now();
  }

  let alertShown = false;
  let alertOnConfirm: (() => Promise<boolean>) | undefined = undefined;
  let alertOnCancel: (() => Promise<void>) | undefined = undefined;
  let alertCurrType: AlertType | undefined = undefined;

  enum AlertType {
    Clear,
    ToNote,
  }

  function showAlert(alertType: AlertType) {
    if (alertType === AlertType.Clear) {
      alertOnConfirm = clear;
      alertOnCancel = undefined;
      alertCurrType = AlertType.Clear;
    } else if (alertType === AlertType.ToNote) {
      alertOnConfirm = convertToNote;
      alertOnCancel = async () => {
        setTimeout(() => {
          noteTitleText = "";
        }, 150);
      };
      alertCurrType = AlertType.ToNote;
    } else {
      alertOnConfirm = undefined;
      alertOnCancel = undefined;
      alertCurrType = undefined;
      return;
    }

    alertShown = true;
  }

  function onTextChange(e: any) {
    shelfText = e.target.value;
  }

  onMount(() => {
    window.addEventListener("unload", () => {
      if (shelf && shelfText != shelf.text) {
        shelfPatch({ text: shelfText });
      }
    });

    load();
  });

  async function save(silent: boolean = true) {
    if (shelfText === shelf?.text) {
      if (!silent) {
        showNotif("The shelf's text hasn't changed");
      }

      return;
    }

    const updatedShelf = await shelfPatch({ text: shelfText });
    if (!updatedShelf) {
      showNotif("Could not save the shelf");
      return;
    }

    updatedShelf.files = shelf ? shelf.files : [];
    shelf = updatedShelf;

    if (!silent) {
      showNotif("Shelf has been saved");
    }
  }

  async function load(silent: boolean = true) {
    shelf = undefined;

    const loadedShelf = await shelfGet();
    if (!loadedShelf) {
      showNotif("Could not load the shelf");
      return;
    }

    shelf = loadedShelf;

    if (!silent) {
      showNotif("Shelf has been refreshed");
    }
  }

  async function convertToNote() {
    if (!noteTitleText) {
      showNotif("Can't create a note with empty title");
      return false;
    }

    const updatedShelf = await shelfToNotePost({
      note_title: noteTitleText,
      note_text: shelfText,
    });

    noteTitleText = "";
    if (!updatedShelf) {
      showNotif("Could not convert the shelf");
      return true;
    }

    shelf = updatedShelf;

    showNotif("The shelf has been converted");
    return true;
  }

  async function clear() {
    const updatedShelf = await shelfDelete();
    if (!updatedShelf) {
      showNotif("Could not clear the shelf");
      return true;
    }

    shelf = updatedShelf;

    showNotif("The shelf has been cleared");
    return true;
  }

  async function copyToClipboard() {
    textElement.select();
    textElement.setSelectionRange(0, textElement.value.length);
    document.execCommand("copy");
    showNotif("Text has been copied");
  }

  async function uploadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.click();

    const file: File | undefined = await new Promise((res, rej) => {
      input.onchange = (e: Event) => {
        res((e.target as HTMLInputElement | null)?.files?.[0]);
      };
    });

    if (!file || !shelf) {
      return;
    }

    const fileInfo = await filePost(shelf.id, file);
    if (!fileInfo) {
      showNotif("Could not upload the file");
      return;
    }

    if (!shelf) {
      return;
    }

    shelf.files = [...shelf.files, fileInfo];
  }

  async function deleteFile(fileId: number) {
    const success = await fileDelete(fileId);
    if (!success) {
      showNotif("Could not delete the file");
      return;
    }

    if (shelf) {
      shelf.files = shelf.files.filter((f) => f.id != fileId);
    }
  }

  async function downloadFile(fileHash: string) {
    const success = await fileGet(fileHash);
    if (!success) {
      showNotif("Could not download the file");
    }
  }
</script>

<Popup bind:lastShown={popupLastShown} bind:duration={popupDuration}>
  {popupMessage}
</Popup>

<AlertDialog
  bind:shown={alertShown}
  bind:onConfirm={alertOnConfirm}
  bind:onCancel={alertOnCancel}
>
  {#if alertCurrType === AlertType.Clear}
    <span class="text-xl">Clear the shelf?</span>
  {:else if alertCurrType === AlertType.ToNote}
    <div class="text-xl">Convert the shelf to a new note</div>
    <input
      bind:value={noteTitleText}
      class="mt-4 w-full text-lg p-1 bg-[#00000050] outline-none rounded-md placeholder-gray-400"
      placeholder="New note title..."
    />
  {:else}
    <span class="text-xl">Undefined alert</span>
  {/if}
</AlertDialog>

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
        placeholder="Shelf text..."
        bind:this={textElement}
        value={shelfText}
        on:input={onTextChange}
        class={"rounded-md p-1 size-full bg-transparent pb-14 md:pb-16 placeholder-gray-400 " +
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
    <Button onclick={() => load(false)} class="flex-1">Refresh</Button>
    <Button
      {disabled}
      onclick={() => showAlert(AlertType.Clear)}
      class="flex-1"
    >
      Clear
    </Button>
    <Button
      {disabled}
      onclick={() => showAlert(AlertType.ToNote)}
      class="flex-1"
    >
      To note
    </Button>
    <Button {disabled} onclick={() => save(false)} class="flex-1">Save</Button>
  </div>
</div>
