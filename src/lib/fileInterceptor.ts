import { HttpException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      if (value.size > 10 * 1024 * 1024) {
        throw new HttpException(
          {
            message: "File cannot uploaded",
            devMessage: "file-size-exceted",
            statusCode: 404,
          },
          404,
        );
      } else {
          return value;
      }
    }
  }
}
