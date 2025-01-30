import { BadRequestException } from '@nestjs/common';

const convertImagesIdsToIntArray = (ids: string): number[] => {
  const idsArray: string[] = ids.split(',');
  const retVal: number[] = [];

  idsArray.map((id) => {
    const convertedId = parseInt(id, 10);

    if (isNaN(convertedId))
      throw new BadRequestException(`One of the ids is not a number.`);

    retVal.push(convertedId);
  });

  return retVal;
};

export default convertImagesIdsToIntArray;
