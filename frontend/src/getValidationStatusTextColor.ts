import { Status } from './types';

const getValidationStatusTextColor = (status: Status) => {
  switch (status) {
    case Status.Draft:
    case Status.Submitted:
      return 'orange';
    case Status.Validated:
      return 'green';
    default:
      return 'red';
  }
};

export default getValidationStatusTextColor;