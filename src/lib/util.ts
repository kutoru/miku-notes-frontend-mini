export function formatDate(timestampInSeconds: number): string {
  const date = new Date(timestampInSeconds * 1000);

  let year = date.getFullYear() % 1000;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();

  return (
    year +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day +
    " " +
    (hour < 10 ? "0" : "") +
    hour +
    ":" +
    (min < 10 ? "0" : "") +
    min
  );
}

export function formatSize(sizeInKb: number): string {
  const mul = 1000;

  let fileSize;
  let postfix;

  if (sizeInKb < mul) {
    fileSize = sizeInKb;
    postfix = "b";
  } else if (sizeInKb < mul * mul) {
    fileSize = sizeInKb / mul;
    postfix = "KB";
  } else if (sizeInKb < mul * mul * mul) {
    fileSize = sizeInKb / (mul * mul);
    postfix = "MB";
  } else {
    fileSize = sizeInKb / (mul * mul * mul);
    postfix = "GB";
  }

  return Math.round(fileSize * 100) / 100 + postfix;
}
