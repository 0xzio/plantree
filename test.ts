async function run() {
  // const host = 'https://api.creem.io/v1/checkouts'
  // const product_id = 'prod_2qHaSRaU3uO7A33lPao5wb'
  // const apiKey = 'creem_pmtATPsoZ0RPHQIN0nEa8'

  const host = 'https://test-api.creem.io/v1/checkouts'
  const product_id = 'prod_3rcSCZWTgb8TLu959z2IZl'
  const apiKey = 'creem_test_2YtiIEISFpGJ4s7JAIsZyk'

  const res = await fetch(host, {
    method: 'POST',
    body: JSON.stringify({
      product_id,
      // session_id: '123456',
      request_id: 'fooo',
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  }).then((response) => response.json())
  console.log('>>>>>>>>>>>>>======:res', res)
}

run()

// /payment-callback?request_id=fooo&checkout_id=ch_2p0jy37FuLAqkTyPiq4m2h&order_id=ord_5oGw1gHa8q79lMeTZRSQdJ&customer_id=cust_432aMoszzUXM4xmHGeRVa7&subscription_id=sub_3mAkT39BtTFspSMybiJnsL&product_id=prod_3rcSCZWTgb8TLu959z2IZl&signature=8a63dc6dcd3543ddf5b0c5967061563443cdd20ee974dd34ea936b7dfc96cb92