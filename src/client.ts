export const getCaptcha = async () =>
  await fetch("http://localhost:8080").then((res) => res.text());
