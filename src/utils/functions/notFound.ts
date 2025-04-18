import { NotFoundException } from '@nestjs/common';

const notFound = (
  entity: string,
  id: number | string,
  entity2?: string,
  id2?: number | string,
) => {
  if (entity2)
    throw new NotFoundException(
      `${entity} with the id ${id} not found in ${entity2} with the id ${id2}`,
    );

  throw new NotFoundException(`${entity} with the id ${id} not found.`);
};

export default notFound;
