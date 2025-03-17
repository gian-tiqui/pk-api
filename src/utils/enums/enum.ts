enum Messages {
  INTERNAL_SERVER = 'There was a problem in the server.',
  IMAGES_ERROR = 'Only image files are allowed.',
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
  ROOM_IMAGES = 4,
}

enum PaginationDefault {
  OFFSET = 0,
  LIMIT = 10,
}

enum Directory {
  UPLOAD = 'uploads',
  ROOM_IMAGES = 'room_images',
  FLOOR_IMAGES = 'floor_images',
}

enum StartingPoint {
  FRONT_ELEVATOR = 10001,
  BACK_ELEVATOR = 10002,
  FRONT_STAIRS = 10003,
  BACK_STAIRS = 10004,
}

export {
  Messages,
  LogMethod,
  LogType,
  PaginationDefault,
  Directory,
  StartingPoint,
};
