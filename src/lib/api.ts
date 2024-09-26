import type { FileInfo } from "$types/file";
import type { Shelf } from "$types/shelf";

const API_URL = "http://192.168.1.12:3030";
const EMAIL = "kuromix@mail.ru";
const PASSWORD = "12345678";

type ResBody<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

type ReqRes<T> = {
  data?: T;
  code: number;
};

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

async function callApi<T, U>(
  path: string,
  method: HttpMethod,
  body: T | undefined = undefined,
  keepalive: boolean = false
): Promise<ReqRes<U>> {
  const result: ResBody<U> | number = await fetch(API_URL + path, {
    method: method,
    headers: { "content-type": "application/json" },
    credentials: "include",
    keepalive: keepalive,
    body: !body ? undefined : JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.status;
      } else {
        return res.json();
      }
    })
    .catch((err) => {
      console.error(err);
      return -1;
    });

  if (typeof result === "number") {
    return { code: result, data: undefined };
  } else {
    return { code: 0, data: result.data };
  }
}

async function handleRequest<U>(
  request: () => Promise<ReqRes<U>>
): Promise<U | undefined> {
  let result = await request();

  if (result.code === 401) {
    await access();
    result = await request();
  }

  return result.data;
}

async function login() {
  await callApi("/login", HttpMethod.POST, {
    email: EMAIL,
    password: PASSWORD,
  });
}

async function access() {
  const result = await callApi("/access", HttpMethod.GET);
  if (result.code === 401) {
    await login();
  }
}

export function shelfGet(): Promise<Shelf | undefined> {
  return handleRequest(() => callApi("/shelf", HttpMethod.GET));
}

export function shelfPatch(body: { text: string }): Promise<Shelf | undefined> {
  return handleRequest(() => callApi("/shelf", HttpMethod.PATCH, body, true));
}

export function shelfDelete(): Promise<Shelf | undefined> {
  return handleRequest(() => callApi("/shelf", HttpMethod.DELETE));
}

export function shelfToNotePost(body: {
  note_text: string;
  note_title: string;
}): Promise<Shelf | undefined> {
  return handleRequest(() => callApi("/shelf/to-note", HttpMethod.POST, body));
}

export function filePost(
  shelfId: number,
  file: File
): Promise<FileInfo | undefined> {
  return handleRequest(async () => {
    const formData = new FormData();
    formData.append("shelf_id", "" + shelfId);
    formData.append("file_size", "" + file.size);
    formData.append("file", file);

    const result: ResBody<FileInfo> | number = await fetch(API_URL + "/files", {
      method: HttpMethod.POST,
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.status;
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.error(err);
        return -1;
      });

    if (typeof result === "number") {
      return { code: result, data: undefined };
    } else {
      return { code: 0, data: result.data };
    }
  });
}

export async function fileDelete(fileId: number): Promise<boolean> {
  const result: {} | undefined = await handleRequest(() =>
    callApi("/files/" + fileId, HttpMethod.DELETE)
  );

  return !!result;
}

export async function fileGet(fileHash: string): Promise<boolean> {
  const result: {} | undefined = await handleRequest(async () => {
    let status = -1;
    let filename = "unknown";

    const result: Blob | undefined = await fetch(
      `${API_URL}/files/dl/${fileHash}`,
      {
        method: HttpMethod.GET,
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) {
          status = res.status;
          return undefined;
        } else {
          let name = res.headers.get("content-disposition")?.split("=")[1];
          if (name) {
            filename = name.slice(1, name.length - 1);
          }

          return res.blob();
        }
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      });

    if (!result) {
      return { code: status, data: undefined };
    }

    downloadBlob(result, filename);

    return { code: 0, data: {} };
  });

  return !!result;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
