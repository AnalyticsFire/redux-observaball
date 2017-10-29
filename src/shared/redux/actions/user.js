import { createAction } from 'redux-act';

const blow = createAction('Execute blow.');
blow.click = createAction('User clicked on blow button.');

export default {
  blow
};
