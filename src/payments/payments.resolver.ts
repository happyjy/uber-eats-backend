import { PaymentService } from './payemtns.service';

export class PaymentsResolver {
  constructor(private readonly paymentService: PaymentService) {}
}
