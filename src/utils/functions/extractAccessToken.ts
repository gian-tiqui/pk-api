const extractAccessToken = (req: Request): string => {
  return req.headers['authorization'].split(' ')[1];
};

export default extractAccessToken;
