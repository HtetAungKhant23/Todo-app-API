interface IResponse {
  statusCode: number;
  message: string;
  body: any;
}

export const responser = ({ statusCode, message, body }: IResponse) => {
  return {
    meta: {
      success: statusCode >= 200 && statusCode <= 300 ? true : false,
      message: message,
    },
    body: body,
  };
};
