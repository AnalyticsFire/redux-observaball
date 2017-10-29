
import moment from 'moment';

export default duration =>
  moment('2000-01-01 00:00:00').add(moment.duration(duration)).format('HH:mm:ss');
