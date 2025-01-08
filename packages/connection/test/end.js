import Connection from "../index.js";

test("#_end", async () => {
  const conn = new Connection();

  const spy_close = jest.spyOn(conn, "close");
  const spy_closeSocket = jest.spyOn(conn, "_closeSocket");

  await conn._end();

  expect(spy_close).toHaveBeenCalledTimes(1);
  expect(spy_closeSocket).toHaveBeenCalledTimes(1);
});

test("#_end with close rejection", async () => {
  const conn = new Connection();

  const spy_close = jest.spyOn(conn, "close").mockImplementation(() => {
    return Promise.reject();
  });
  const spy_closeSocket = jest.spyOn(conn, "_closeSocket");

  await conn._end();

  expect(spy_close).toHaveBeenCalledTimes(1);
  expect(spy_closeSocket).toHaveBeenCalledTimes(1);
});

test("#_end with disconnect rejection", async () => {
  const conn = new Connection();

  const spy_close = jest.spyOn(conn, "close");
  const spy_closeSocket = jest
    .spyOn(conn, "_closeSocket")
    .mockImplementation(() => {
      return Promise.reject();
    });

  await conn._end();

  expect(spy_close).toHaveBeenCalledTimes(1);
  expect(spy_closeSocket).toHaveBeenCalledTimes(1);
});

test("#_end with close and disconnect rejection", async () => {
  const conn = new Connection();

  const spy_close = jest.spyOn(conn, "close").mockImplementation(() => {
    return Promise.reject();
  });
  const spy_closeSocket = jest
    .spyOn(conn, "_closeSocket")
    .mockImplementation(() => {
      return Promise.reject();
    });

  await conn._end();

  expect(spy_close).toHaveBeenCalledTimes(1);
  expect(spy_closeSocket).toHaveBeenCalledTimes(1);
});
