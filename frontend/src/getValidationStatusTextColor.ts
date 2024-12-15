import { Status } from './types';

const getValidationStatusTextColor = (status: Status) => {
  switch (status) {
    case Status.Draft:
      return 'grey';
    case Status.Validated:
      return 'orange';
    case Status.Submitted:
      return 'green';
    default:
      return 'red';
  }
};

export default getValidationStatusTextColor;