import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { OrdersService } from '../orders/orders.service';
import {OrderStatusesEnum} from "../orders/enums/order-statuses.enum";

@Injectable()
export class PaymentsService {
  constructor(private orderService: OrdersService) {}

  accessToken: string = null;

  async authorize() {
    const credentials = `${process.env.PAYPAL_USERNAME}:${process.env.PAYPAL_PASSWORD}`;

    const response = await fetch(`${process.env.PAYPAL_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        Authorization: 'Basic ' + Buffer.from(credentials).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  async createOrder(orderId: number) {
    await this.authorize();

    const order = await this.orderService.findById(orderId);
    const platformFee = (Number(order.amount) / 100) * 20;

    const response = await fetch(
      `${process.env.PAYPAL_URL}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
          'PayPal-Partner-Attribution-Id':
            process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: `${order.amount}`,
              },
              payee: {
                email_address: 'iovitatudor@gmail.com',
              },
              payment_instruction: {
                disbursement_mode: 'INSTANT',
                platform_fees: [
                  {
                    amount: {
                      currency_code: 'USD',
                      value: `${platformFee}`,
                    },
                  },
                ],
              },
            },
          ],
        }),
      },
    );
    const data = await response.json();
    return data;
  }

  async capturePayment(paypalOrderId, orderId) {
    await this.authorize();
    const url = `${process.env.PAYPAL_URL}/v2/checkout/orders/${paypalOrderId}/capture`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const data = await response.json();

    // const orderData = {
    //   status: OrderStatusesEnum.Completed,
    // };
    // await this.orderService.update(orderId, orderData);
    return data;
  }
}