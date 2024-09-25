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
  body: T | undefined = undefined
): Promise<ReqRes<U>> {
  const result: ResBody<U> | number = await fetch(API_URL + path, {
    method: method,
    headers: { "content-type": "application/json" },
    credentials: "include",
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

export function shelfPost(body: { text: string }): Promise<Shelf | undefined> {
  return handleRequest(() => callApi("/shelf", HttpMethod.POST, body));
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

// export function filePost(file: unknown): Promise<FileInfo | undefined> {
//   return handleRequest(() => {});
// }

// export function fileGet(fileHash: string): Promise<boolean | undefined> {
//   return handleRequest(() => {});
// }

// export function fileDelete(fileId: number): Promise<boolean | undefined> {
//   return handleRequest(() => {});
// }
