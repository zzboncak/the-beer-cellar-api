# The Beer Cellar API

This server exists to support The Beer Cellar client

### Base URL: https://secret-plateau-55760.herokuapp.com/api

## Overview:

This API exists so that users can keep track of their carefully curated beers. It is integrated with Untappd's search features to have a standardized format and catalog of beers available to the user. A user is able to search Untappd's database of beers, select the one they want to add to their cellar, and store that data. In addition to Untappd's data, through The Beer Cellar API a user can keep track of how many beers they have for a quick reference.

### Authorization:

This app uses JWTs to authenticate usage. Calling any of the endpoints bellow will require the "Authorization" header to be present with a valid JWT.

**Example:**

```javascript
fetch('https://secret-plateau-55760.herokuapp.com/api/cellar', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${YOUR_JWT}`
    }
}
```

To obtain a valid JWT, you must either call the login endpoint (see below), or register a new account if you haven't already: [The Beer Cellar Register Page](https://the-beer-cellar-app.now.sh/register)

## Endpoints:

#### Login using POST /auth/login

Call this endpoint to receive a valid JWT. The body of the request must contain valid credentials from a registered user and include the keys `username`, and `user_password`.

**Example:**
```javascript
let credentials = {
    username: 'your_username',
    user_password: 'SuPerSeCurePassWorD123'
}
fetch(`https://secret-plateau-55760.herokuapp.com/api/auth/login`, {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify(credentials),
```
**Example response:**
```javascript
{
    "authToken": "your_JWT"
}
```

#### Register as a new user using POST /users

Call this endpoint to create a new account with The Beer Cellar. With successful credentials, a valid JWT is returned. You must include the keys `username`, and `user_password` in your request body. 

*Password Requirements:* Your password needs to be greater than 8 but less than 72 characters, and include at least one upper case character and one lower case character.

When successful, the API will respond with a status of `201` with your valid JWT in the body of the response.

**Example:**
```javascript
let credentials = {
    username: 'your_username',
    user_password: 'SuPerSeCurePassWorD123'
}
fetch(`https://secret-plateau-55760.herokuapp.com/api/users`, {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify(credentials),
```
**Example response:**
```javascript
{
    "authToken": "your_JWT"
}
```

#### Search Untappd's database using GET /search/:beer_name

This is essentially utilizing Untappd's API found at [Untappd's API Docs](https://untappd.com/api/docs#beersearch). The beer_name paramater is a required string. Replace spaces with a plus sign:

**Example:**
```javascript
let searchTerm = 'bourbon+county+2019';
fetch(`https://secret-plateau-55760.herokuapp.com/api/search/${searchTerm}`)
    .then(res => res.json())
    .then(data => console.log(data));
```
*Note: this is the only endpoint for The Beer Cellar API that is not protected.*

**Example response:**
```javascript
{
    "meta": {
        "code": 200,
        "response_time": {
            "time": 0.126,
            "measure": "seconds"
        },
        "init_time": {
            "time": 0,
            "measure": "seconds"
        }
    },
    "notifications": [],
    "response": {
        "message": "",
        "time_taken": 0.034,
        "brewery_id": 0,
        "search_type": "",
        "type_id": 0,
        "search_version": 4,
        "found": 13,
        "offset": 0,
        "limit": 25,
        "term": "bourbon county 2019",
        "parsed_term": "bourbon county 2019",
        "beers": {
            "count": 13,
            "items": [
                {
                    "checkin_count": 38191,
                    "have_had": false,
                    "your_count": 0,
                    "beer": {
                        "bid": 3507187,
                        "beer_name": "Bourbon County Brand Stout (2019) 14.7%",
                        "beer_label": "https://untappd.akamaized.net/site/beer_logos/beer-3200860_3e2be_sm.jpeg",
                        "beer_abv": 14.7,
                        "beer_slug": "goose-island-beer-co-bourbon-county-brand-stout-2019-147",
                        "beer_ibu": 60,
                        "beer_description": "This year’s Bourbon County Stout, aged in a mix of Heaven Hill, Buffalo Trace, and Wild Turkey barrels, yields a rich, complex mouthfeel. Flavors of cocoa, fudge, vanilla, caramel, almond, plus leather and tobacco, permeate this beer and deepen with each sip. We’ve bottled Bourbon County Stout for 15 years and this year’s vintage is one that you will want to hold on to for years to come.",
                        "created_at": "Wed, 30 Oct 2019 23:06:41 +0000",
                        "beer_style": "Stout - American Imperial / Double",
                        "in_production": 1,
                        "auth_rating": 0,
                        "wish_list": false
                    },
                    "brewery": {
                        "brewery_id": 2898,
                        "brewery_name": "Goose Island Beer Co.",
                        "brewery_slug": "goose-island-beer-co",
                        "brewery_page_url": "/gooseisland",
                        "brewery_type": "Macro Brewery",
                        "brewery_label": "https://untappd.akamaized.net/site/brewery_logos/brewery-2898_7ee53.jpeg",
                        "country_name": "United States",
                        "contact": {
                            "twitter": "GooseIsland",
                            "facebook": "https://m.facebook.com/Goose-Island-157863547303/",
                            "instagram": "gooseisland",
                            "url": "http://www.gooseisland.com/"
                        },
                        "location": {
                            "brewery_city": "Chicago",
                            "brewery_state": "IL",
                            "lat": 41.8871,
                            "lng": -87.6721
                        },
                        "brewery_active": 1
                    }
                },
                ...
```


#### 'GET /cellar'

This endpoint returns an array of beers the logged in user has in inventory. 

**Example:**
```javascript
fetch('https://secret-plateau-55760.herokuapp.com/api/cellar', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${YOUR_JWT}`
    }
}
```

**Example response:**
```javascript
[
    {
        "inventory_id": 9,
        "beer_name": "Bourbon Bear-Ale (2018)",
        "quantity": 1,
        "beer_description": "A delicious Amber Ale, brewed with Bitter Orange Peel, Coriander and then seasonally Aged in Four Roses Kentucky Bourbon Barrels",
        "untappd_rating": 3.82955,
        "brewery_name": "Floyd County Brewing Company",
        "beer_image": "https://untappd.akamaized.net/site/beer_logos/beer-2788092_82dfd_sm.jpeg",
        "untappd_beer_id": 2788092,
        "beer_style": "Other",
        "brewery_id": 224809
    },
    {
        "inventory_id": 13,
        "beer_name": "Bourbon County Brand Stout (2019) 14.7%",
        "quantity": 2,
        "beer_description": "This year’s Bourbon County Stout, aged in a mix of Heaven Hill, Buffalo Trace, and Wild Turkey barrels, yields a rich, complex mouthfeel. Flavors of cocoa, fudge, vanilla, caramel, almond, plus leather and tobacco, permeate this beer and deepen with each sip. We’ve bottled Bourbon County Stout for 15 years and this year’s vintage is one that you will want to hold on to for years to come.",
        "untappd_rating": 4.44844,
        "brewery_name": "Goose Island Beer Co.",
        "beer_image": "https://untappd.akamaized.net/site/beer_logos/beer-3200860_3e2be_sm.jpeg",
        "untappd_beer_id": 3507187,
        "beer_style": "Stout - American Imperial / Double",
        "brewery_id": 2898
    },
    {
        "inventory_id": 14,
        "beer_name": "Bourbon County Brand Coffee Stout",
        "quantity": 2,
        "beer_description": "Everyday Goose Island smells the wonderful coffee roasting next to our brewery at Chicago's Intelligentsia Coffee and Tea. They put the same passion and skill into their coffee as Goose Island does with its beer. This excellent stout is made with Black Cat Espresso beans from our friends next door. You'll like the combination.",
        "untappd_rating": 4.53617,
        "brewery_name": "Goose Island Beer Co.",
        "beer_image": "https://untappd.akamaized.net/site/beer_logos/beer-5817_24ce1_sm.jpeg",
        "untappd_beer_id": 5817,
        "beer_style": "Stout - Coffee",
        "brewery_id": 2898
    },
    {
        "inventory_id": 15,
        "beer_name": "Two Hearted Ale",
        "quantity": 1,
        "beer_description": "Brewed with 100% Centennial hops from the Pacific Northwest and named after the Two Hearted River in Michigan’s Upper Peninsula, this IPA is bursting with hop aromas ranging from pine to grapefruit from massive hop additions in both the kettle and the fermenter.\r\n\r\nPerfectly balanced with a malt backbone and combined with the signature fruity aromas of Bell's house yeast, this beer is remarkably drinkable and well suited for adventures everywhere.",
        "untappd_rating": 3.96372,
        "brewery_name": "Bell's Brewery",
        "beer_image": "https://untappd.akamaized.net/site/beer_logos/beer-4133_13fdb_sm.jpeg",
        "untappd_beer_id": 4133,
        "beer_style": "IPA - American",
        "brewery_id": 2507
    }
]
```

#### 'POST /cellar/:bid'

'bid' stands for Untappd's Beer Id, which can be found using the 'GET /search/:beer_name'. Calling this endpoint will attempt to add the beer with that Untappd Id to the logged in user's inventory. If the beer doesn't exist in The Beer Cellar's database, it first adds the beer and then the inventory is added for the user. If the user already has this beer in his/her inventory, the quantity of the beer is simply increased by one.

When successful, if the user did not have the beer prior to making the call, the API responds with a status of `201` and the message 'Inventory added'. Else, if the user already had that beer in the inventory, the API will respond with `204` no content.

**Example:**
```javascript
fetch(`https://secret-plateau-55760.herokuapp.com/api/cellar/${bid}`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${YOUR_JWT}`
    }
})
```

#### 'PATCH /cellar/inventory'

This endpoint is used to update a user's inventory. The body of the request must contain the fields **inventory_id** and **updatedQuantity**. Your inventory_id number can be found by calling GET /cellar when logged in.

When successful, the API responds with a status code of `204` no content.

**Example:**
```javascript
let updateFields = {
    inventory_id: 15,
    updatedQuantity: 7
};

fetch(`https://secret-plateau-55760.herokuapp.com/api/cellar/inventory`, {
    method: 'PATCH',
    headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${YOUR_JWT}`
    },
    body: JSON.stringify(updateFields)
})
```

#### 'DELETE /cellar/inventory'

This endpoint deletes a line of inventory from the database. The body of the request must contain the **inventory_id** field. Your inventory_id number can be found by calling GET /cellar when logged in.

When successful, the API responds with a status code of `204` no content.

**Example:**
```javascript
fetch(`https://secret-plateau-55760.herokuapp.com/api/cellar/inventory`, {
    method: 'DELETE',
    headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${YOUR_JWT}`
    },
    body: JSON.stringify({ inventory_id: 15 })
})
```

### Developed by Zachary Zboncak

### Technologies used

**Client-side: [The Beer Cellar Client](https://github.com/zzboncak/the-beer-cellar-client)**
- React.js
- HTML
- CSS
- Javascript

**Server-side:**
- Node.js
- Express
- PostgreSQL

Powered by [Untappd](https://untappd.com/api/docs)