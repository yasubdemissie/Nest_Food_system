import {
  //   ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UserParserPipe implements PipeTransform {
  transform(value: unknown) {
    if (!value || typeof value !== 'object') throw new BadRequestException();
    const data = Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        val === undefined ? null : val,
      ]),
    );

    return data;
  }
}
