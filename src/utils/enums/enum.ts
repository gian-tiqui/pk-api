enum Messages {
  INTERNAL_SERVER = 'There was a problem in the server.',
}

enum LogMethod {
  CREATE = 1,
  UPDATE = 2,
  SOFT_DELETE = 3,
  DELETE = 4,
  RETRIEVE = 5,
}

enum LogType {
  FLOOR = 1,
  ROOM = 2,
  USER = 3,
}

enum PaginationDefault {
  OFFSET = 0,
  LIMIT = 10,
}

export { Messages, LogMethod, LogType, PaginationDefault };
