const checkoutCompleted = {
  id: 'evt_7JhMGqaA5yNrqOom5ElThG',
  eventType: 'checkout.completed',
  created_at: 1740490923616,
  object: {
    id: 'ch_1Cz8ZG7Gs9677mlZYhxs0Z',
    object: 'checkout',
    request_id: 'FREE___03df5674-cd3f-422c-bb9c-2019c54b095b',
    order: {
      id: 'ord_1NtX6N1ZPhjiZ5vcll0EO0',
      customer: 'cust_432aMoszzUXM4xmHGeRVa7',
      product: 'prod_3rcSCZWTgb8TLu959z2IZl',
      amount: 500,
      currency: 'USD',
      status: 'paid',
      type: 'recurring',
      created_at: '2025-02-25T13:41:19.103Z',
      updated_at: '2025-02-25T13:41:19.103Z',
      mode: 'test',
    },
    product: {
      id: 'prod_3rcSCZWTgb8TLu959z2IZl',
      name: 'Penx Test',
      description: 'Penx test',
      image_url:
        'https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/logo-512-FGsNeTBLmdOvY5ld37h4OOCvgXEm6p.png',
      price: 500,
      currency: 'USD',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: 'http://localhost:4000/payment-callback',
      created_at: '2025-02-25T01:12:00.031Z',
      updated_at: '2025-02-25T01:12:00.031Z',
      mode: 'test',
    },
    units: 1,
    customer: {
      id: 'cust_432aMoszzUXM4xmHGeRVa7',
      object: 'customer',
      email: 'forsigner@gmail.com',
      name: 'CHEN',
      country: 'HK',
      created_at: '2025-02-25T01:26:08.922Z',
      updated_at: '2025-02-25T01:26:08.922Z',
      mode: 'test',
    },
    subscription: {
      id: 'sub_6uSetppT1VTMZsrKMMp19C',
      object: 'subscription',
      product: 'prod_3rcSCZWTgb8TLu959z2IZl',
      customer: 'cust_432aMoszzUXM4xmHGeRVa7',
      collection_method: 'charge_automatically',
      status: 'active',
      current_period_start_date: '2025-02-25T13:41:49.000Z',
      current_period_end_date: '2025-03-25T13:41:49.000Z',
      canceled_at: null,
      created_at: '2025-02-25T13:41:54.174Z',
      updated_at: '2025-02-25T13:41:54.511Z',
      metadata: [Object],
      mode: 'test',
    },
    custom_fields: [],
    status: 'completed',
    metadata: {
      userId: '03df5674-cd3f-422c-bb9c-2019c54b095b',
      planType: 'FREE',
    },
    mode: 'test',
  },
}

const subscriptionActive = {
  id: 'evt_1C2YgBeIZfvhmOWMzCR6Sk',
  eventType: 'subscription.active',
  created_at: 1740490914579,
  object: {
    id: 'sub_6uSetppT1VTMZsrKMMp19C',
    object: 'subscription',
    product: {
      id: 'prod_3rcSCZWTgb8TLu959z2IZl',
      name: 'Penx Test',
      description: 'Penx test',
      image_url:
        'https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/logo-512-FGsNeTBLmdOvY5ld37h4OOCvgXEm6p.png',
      price: 500,
      currency: 'USD',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: 'http://localhost:4000/payment-callback',
      created_at: '2025-02-25T01:12:00.031Z',
      updated_at: '2025-02-25T01:12:00.031Z',
      mode: 'test',
    },
    customer: {
      id: 'cust_432aMoszzUXM4xmHGeRVa7',
      object: 'customer',
      email: 'forsigner@gmail.com',
      name: 'CHEN',
      country: 'HK',
      created_at: '2025-02-25T01:26:08.922Z',
      updated_at: '2025-02-25T01:26:08.922Z',
      mode: 'test',
    },
    items: [[Object]],
    collection_method: 'charge_automatically',
    status: 'active',
    current_period_start_date: '2025-02-25T13:41:49.000Z',
    current_period_end_date: '2025-03-25T13:41:49.000Z',
    canceled_at: null,
    created_at: '2025-02-25T13:41:54.174Z',
    updated_at: '2025-02-25T13:41:54.511Z',
    metadata: {
      userId: '03df5674-cd3f-422c-bb9c-2019c54b095b',
      planType: 'FREE',
    },
    mode: 'test',
  },
}

const subscriptionPaid = {
  id: 'evt_41EVjyqUdP532KzbfzS69X',
  eventType: 'subscription.paid',
  created_at: 1740490923417,
  object: {
    id: 'sub_6uSetppT1VTMZsrKMMp19C',
    object: 'subscription',
    product: {
      id: 'prod_3rcSCZWTgb8TLu959z2IZl',
      name: 'Penx Test',
      description: 'Penx test',
      image_url:
        'https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/logo-512-FGsNeTBLmdOvY5ld37h4OOCvgXEm6p.png',
      price: 500,
      currency: 'USD',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: 'http://localhost:4000/payment-callback',
      created_at: '2025-02-25T01:12:00.031Z',
      updated_at: '2025-02-25T01:12:00.031Z',
      mode: 'test',
    },
    customer: {
      id: 'cust_432aMoszzUXM4xmHGeRVa7',
      object: 'customer',
      email: 'forsigner@gmail.com',
      name: 'CHEN',
      country: 'HK',
      created_at: '2025-02-25T01:26:08.922Z',
      updated_at: '2025-02-25T01:26:08.922Z',
      mode: 'test',
    },
    items: [[Object]],
    collection_method: 'charge_automatically',
    status: 'active',
    last_transaction_id: 'tran_363QAGH8gotT7tijuh6TkC',
    last_transaction_date: '2025-02-25T13:42:00.374Z',
    next_transaction_date: '2025-03-25T13:41:49.000Z',
    current_period_start_date: '2025-02-25T13:41:49.000Z',
    current_period_end_date: '2025-03-25T13:41:49.000Z',
    canceled_at: null,
    created_at: '2025-02-25T13:41:54.174Z',
    updated_at: '2025-02-25T13:41:54.511Z',
    metadata: {
      userId: '03df5674-cd3f-422c-bb9c-2019c54b095b',
      planType: 'FREE',
    },
    mode: 'test',
  },
}

const subscriptionCanceled = {
  id: 'evt_2iGTc600qGW6FBzloh2Nr7',
  eventType: 'subscription.canceled',
  created_at: 1728734337932,
  object: {
    id: 'sub_6pC2lNB6joCRQIZ1aMrTpi',
    object: 'subscription',
    product: {
      id: 'prod_d1AY2Sadk9YAvLI0pj97f',
      name: 'Monthly',
      description: 'Monthly',
      image_url: null,
      price: 1000,
      currency: 'EUR',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: '',
      created_at: '2024-10-11T11:50:00.182Z',
      updated_at: '2024-10-11T11:50:00.182Z',
      mode: 'local',
    },
    customer: {
      id: 'cust_1OcIK1GEuVvXZwD19tjq2z',
      object: 'customer',
      email: 'tester@gmail.com',
      name: 'Tester Test',
      country: 'NL',
      created_at: '2024-10-11T09:16:48.557Z',
      updated_at: '2024-10-11T09:16:48.557Z',
      mode: 'local',
    },
    collection_method: 'charge_automatically',
    status: 'canceled',
    last_transaction_id: 'tran_5yMaWzAl3jxuGJMCOrYWwk',
    last_transaction_date: '2024-10-12T11:58:47.109Z',
    current_period_start_date: '2024-10-12T11:58:38.000Z',
    current_period_end_date: '2024-11-12T11:58:38.000Z',
    canceled_at: '2024-10-12T11:58:57.813Z',
    created_at: '2024-10-12T11:58:45.425Z',
    updated_at: '2024-10-12T11:58:57.827Z',
    metadata: {
      custom_data: 'mycustom data',
      internal_customer_id: 'internal_customer_id',
    },
    mode: 'local',
  },
}

const subscriptionExpired = {
  id: 'evt_V5CxhipUu10BYonO2Vshb',
  eventType: 'subscription.expired',
  created_at: 1734463872058,
  object: {
    id: 'sub_7FgHvrOMC28tG5DEemoCli',
    object: 'subscription',
    product: {
      id: 'prod_3ELsC3Lt97orn81SOdgQI3',
      name: 'Subs',
      description: 'Subs',
      image_url: null,
      price: 1200,
      currency: 'EUR',
      billing_type: 'recurring',
      billing_period: 'every-year',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: '',
      created_at: '2024-12-11T17:33:32.186Z',
      updated_at: '2024-12-11T17:33:32.186Z',
      mode: 'local',
    },
    customer: {
      id: 'cust_3y4k2CELGsw7n9Eeeiw2hm',
      object: 'customer',
      email: 'alecerasmus2@gmail.com',
      name: 'Alec Erasmus',
      country: 'NL',
      created_at: '2024-12-09T16:09:20.709Z',
      updated_at: '2024-12-09T16:09:20.709Z',
      mode: 'local',
    },
    collection_method: 'charge_automatically',
    status: 'active',
    last_transaction_id: 'tran_6ZeTvMqMkGdAIIjw5aAcnh',
    last_transaction_date: '2024-12-16T12:40:12.658Z',
    next_transaction_date: '2025-12-16T12:39:47.000Z',
    current_period_start_date: '2024-12-16T12:39:47.000Z',
    current_period_end_date: '2024-12-16T12:39:47.000Z',
    canceled_at: null,
    created_at: '2024-12-16T12:40:05.058Z',
    updated_at: '2024-12-16T12:40:05.058Z',
    mode: 'local',
  },
}

const refundCreated = {
  id: 'evt_61eTsJHUgInFw2BQKhTiPV',
  eventType: 'refund.created',
  created_at: 1728734351631,
  object: {
    id: 'ref_3DB9NQFvk18TJwSqd0N6bd',
    object: 'refund',
    status: 'succeeded',
    refund_amount: 1210,
    refund_currency: 'EUR',
    reason: 'requested_by_customer',
    transaction: {
      id: 'tran_5yMaWzAl3jxuGJMCOrYWwk',
      object: 'transaction',
      amount: 1000,
      amount_paid: 1210,
      currency: 'EUR',
      type: 'invoice',
      tax_country: 'NL',
      tax_amount: 210,
      status: 'refunded',
      refunded_amount: 1210,
      order: 'ord_4aDwWXjMLpes4Kj4XqNnUA',
      subscription: 'sub_6pC2lNB6joCRQIZ1aMrTpi',
      description: 'Subscription payment',
      period_start: 1728734318000,
      period_end: 1731412718000,
      created_at: 1728734327109,
      mode: 'local',
    },
    subscription: {
      id: 'sub_6pC2lNB6joCRQIZ1aMrTpi',
      object: 'subscription',
      product: 'prod_d1AY2Sadk9YAvLI0pj97f',
      customer: 'cust_1OcIK1GEuVvXZwD19tjq2z',
      collection_method: 'charge_automatically',
      status: 'canceled',
      last_transaction_id: 'tran_5yMaWzAl3jxuGJMCOrYWwk',
      last_transaction_date: '2024-10-12T11:58:47.109Z',
      current_period_start_date: '2024-10-12T11:58:38.000Z',
      current_period_end_date: '2024-11-12T11:58:38.000Z',
      canceled_at: '2024-10-12T11:58:57.813Z',
      created_at: '2024-10-12T11:58:45.425Z',
      updated_at: '2024-10-12T11:58:57.827Z',
      metadata: {
        custom_data: 'mycustom data',
        internal_customer_id: 'internal_customer_id',
      },
      mode: 'local',
    },
    checkout: {
      id: 'ch_4l0N34kxo16AhRKUHFUuXr',
      object: 'checkout',
      request_id: 'my-request-id',
      custom_fields: [],
      status: 'completed',
      metadata: {
        custom_data: 'mycustom data',
        internal_customer_id: 'internal_customer_id',
      },
      mode: 'local',
    },
    order: {
      id: 'ord_4aDwWXjMLpes4Kj4XqNnUA',
      customer: 'cust_1OcIK1GEuVvXZwD19tjq2z',
      product: 'prod_d1AY2Sadk9YAvLI0pj97f',
      amount: 1000,
      currency: 'EUR',
      status: 'paid',
      type: 'recurring',
      created_at: '2024-10-12T11:58:33.097Z',
      updated_at: '2024-10-12T11:58:33.097Z',
      mode: 'local',
    },
    customer: {
      id: 'cust_1OcIK1GEuVvXZwD19tjq2z',
      object: 'customer',
      email: 'tester@gmail.com',
      name: 'Tester Test',
      country: 'NL',
      created_at: '2024-10-11T09:16:48.557Z',
      updated_at: '2024-10-11T09:16:48.557Z',
      mode: 'local',
    },
    created_at: 1728734351525,
    mode: 'local',
  },
}

const subscriptionUpdate = {
  id: 'evt_5pJMUuvqaqvttFVUvtpY32',
  eventType: 'subscription.update',
  created_at: 1737890536421,
  object: {
    id: 'sub_2qAuJgWmXhXHAuef9k4Kur',
    object: 'subscription',
    product: {
      id: 'prod_1dP15yoyogQe2seEt1Evf3',
      name: 'Monthly Sub',
      description: 'Test Test',
      image_url: null,
      price: 1000,
      currency: 'EUR',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: '',
      created_at: '2025-01-26T11:17:16.082Z',
      updated_at: '2025-01-26T11:17:16.082Z',
      mode: 'local',
    },
    customer: {
      id: 'cust_2fQZKKUZqtNhH2oDWevQkW',
      object: 'customer',
      email: 'tester@gmail.com',
      name: 'John Doe',
      country: 'NL',
      created_at: '2025-01-26T11:18:24.071Z',
      updated_at: '2025-01-26T11:18:24.071Z',
      mode: 'local',
    },
    items: [
      {
        object: 'subscription_item',
        id: 'sitem_3QWlqRbAat2eBRakAxFtt9',
        product_id: 'prod_5jnudVkLGZWF4AqMFBs5t5',
        price_id: 'pprice_4W0mJK6uGiQzHbVhfaFTl1',
        units: 1,
        created_at: '2025-01-26T11:20:40.296Z',
        updated_at: '2025-01-26T11:20:40.296Z',
        mode: 'local',
      },
    ],
    collection_method: 'charge_automatically',
    status: 'active',
    current_period_start_date: '2025-01-26T11:20:36.000Z',
    current_period_end_date: '2025-02-26T11:20:36.000Z',
    canceled_at: null,
    created_at: '2025-01-26T11:20:40.292Z',
    updated_at: '2025-01-26T11:22:16.388Z',
    mode: 'local',
  },
}

const subscriptionTrialing = {
  id: 'evt_2ciAM8ABYtj0pVueeJPxUZ',
  eventType: 'subscription.trialing',
  created_at: 1739963911073,
  object: {
    id: 'sub_dxiauR8zZOwULx5QM70wJ',
    object: 'subscription',
    product: {
      id: 'prod_3kpf0ZdpcfsSCQ3kDiwg9m',
      name: 'trail',
      description: 'asdfasf',
      image_url: null,
      price: 1100,
      currency: 'EUR',
      billing_type: 'recurring',
      billing_period: 'every-month',
      status: 'active',
      tax_mode: 'exclusive',
      tax_category: 'saas',
      default_success_url: '',
      created_at: '2025-02-19T11:18:07.570Z',
      updated_at: '2025-02-19T11:18:07.570Z',
      mode: 'test',
    },
    customer: {
      id: 'cust_4fpU8kYkQmI1XKBwU2qeME',
      object: 'customer',
      email: 'alecerasmus2@gmail.com',
      name: 'Alec Erasmus',
      country: 'NL',
      created_at: '2024-11-07T23:21:11.763Z',
      updated_at: '2024-11-07T23:21:11.763Z',
      mode: 'test',
    },
    items: [
      {
        object: 'subscription_item',
        id: 'sitem_1xbHCmIM61DHGRBCFn0W1L',
        product_id: 'prod_3kpf0ZdpcfsSCQ3kDiwg9m',
        price_id: 'pprice_517h9CebmM3P079bGAXHnE',
        units: 1,
        created_at: '2025-02-19T11:18:30.690Z',
        updated_at: '2025-02-19T11:18:30.690Z',
        mode: 'test',
      },
    ],
    collection_method: 'charge_automatically',
    status: 'trialing',
    current_period_start_date: '2025-02-19T11:18:25.000Z',
    current_period_end_date: '2025-02-26T11:18:25.000Z',
    canceled_at: null,
    created_at: '2025-02-19T11:18:30.674Z',
    updated_at: '2025-02-19T11:18:30.674Z',
    mode: 'test',
  },
}

export type CheckoutCompleted = typeof checkoutCompleted
export type SubscriptionActive = typeof subscriptionActive
export type SubscriptionPaid = typeof subscriptionPaid
export type SubscriptionCanceled = typeof subscriptionCanceled
export type SubscriptionExpired = typeof subscriptionExpired
export type RefundCreated = typeof refundCreated
export type SubscriptionUpdate = typeof subscriptionUpdate
export type SubscriptionTrialing = typeof subscriptionTrialing

export function isCheckoutCompleted(
  payload: any,
): payload is CheckoutCompleted {
  return payload?.eventType === checkoutCompleted.eventType
}

export function isSubscriptionActive(
  payload: any,
): payload is SubscriptionActive {
  return payload?.eventType === subscriptionActive.eventType
}

export function isSubscriptionPaid(payload: any): payload is SubscriptionPaid {
  return payload?.eventType === subscriptionPaid.eventType
}

export function isSubscriptionCanceled(
  payload: any,
): payload is SubscriptionCanceled {
  return payload?.eventType === subscriptionCanceled.eventType
}

export function isSubscriptionExpired(
  payload: any,
): payload is SubscriptionExpired {
  return payload?.eventType === subscriptionExpired.eventType
}

export function isRefundCreated(payload: any): payload is RefundCreated {
  return payload?.eventType === refundCreated.eventType
}

export function isSubscriptionUpdate(
  payload: any,
): payload is SubscriptionUpdate {
  return payload?.eventType === subscriptionUpdate.eventType
}

export function isSubscriptionTrialing(
  payload: any,
): payload is SubscriptionTrialing {
  return payload?.eventType === subscriptionTrialing.eventType
}
