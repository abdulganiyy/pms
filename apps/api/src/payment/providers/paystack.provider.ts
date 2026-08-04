import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider } from '../payment.interface';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { AxiosError } from 'axios';

@Injectable()
export class PaystackService implements PaymentProvider {
  private readonly logger = new Logger(PaystackService.name);

  constructor(private prismaService: PrismaService) {}

  async createCustomer(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    const response = await axios.post(
      'https://api.paystack.co/customer',

      {
        ...data,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
        },
      },
    );

    return response.data.data.customer_code;
  }

  async createVirtualAccount(customerId: string) {
    const response = await axios.post(
      'https://api.paystack.co/dedicated_account',

      {
        customer: customerId,
        preferred_bank: 'titan-paystack',
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
        },
      },
    );

    return {
      provider: response.data.data.bank.id,

      bankName: response.data.data.bank.name,

      accountNumber: response.data.data.account_number,

      accountName: response.data.data.account_name,
    };
  }
}
