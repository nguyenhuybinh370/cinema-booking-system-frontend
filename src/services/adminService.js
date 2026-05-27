import movieService from './admin/movieService';
import roomService from './admin/roomService';
import personnelService from './admin/personnelService';
import pricingService from './admin/pricingService';
import shiftService from './admin/shiftService';
import showtimeService from './admin/showtimeService';
import customerService from './admin/customerService';
import transactionService from './admin/transactionService';
import statsService from './admin/statsService';
import seatService from './admin/seatService';

const adminService = {
  ...movieService,
  ...roomService,
  ...personnelService,
  ...pricingService,
  ...shiftService,
  ...showtimeService,
  ...customerService,
  ...transactionService,
  ...statsService,
  ...seatService
};

export default adminService;
