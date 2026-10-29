## Day 1

### Server vs browser
Server components run on the server, so that is where database queries and secret keys
(like the Anthropic API key) live, and where users can never see or change the code.
Client components, marked "use client", run in the browser, so they handle clicks and
state like my counter, and anything inside them is visible to the user. This matters
because a key or query placed in browser code is exposed, so sensitive work stays on
the server and only the interactive parts go to the client.

### owner_id and row level security
owner_id records which seller owns each row, and row level security makes Postgres
itself return or change only the rows where owner_id equals the logged-in user's id
(auth.uid()). So even if my app code has a bug, or someone calls the API directly with
the public key, one seller can never read or edit another seller's menu or orders.

### Why order_items is separate from orders
One order can contain any number of items, so I store each item as a row in order_items
linked by order_id, instead of adding columns like item1, item2, item3 to orders. It also
makes it easy to total quantities per menu item across orders for the production list,
and deleting an order automatically deletes its items (on delete cascade).

### What the proxy does
On every request it asks Supabase whether the login token is still valid, refreshes the
cookie if the token is about to expire, and redirects logged-out users from /dashboard
to /login. Without it, users would be logged out about every hour, and the dashboard
would not be protected before it loads.

### getUser vs getSession
getUser() sends the token to Supabase's Auth server, which verifies it, so I can trust
the result. getSession() only reads the cookie, which a user could tamper with, so on
the server I always use getUser().