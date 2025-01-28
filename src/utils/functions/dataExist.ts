import { BadRequestException } from '@nestjs/common';

const dataExists = (entity: string) => {
  throw new BadRequestException(`The ${entity} already exists.`);
};

export default dataExists;
