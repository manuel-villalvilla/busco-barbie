# BuscoBarbie.com

## Functional Description

- Available countries:
    - ES
    - AR
    - MX

- Use Cases: 
    - Looking for a second hand Barbie doll or accessory
    - Willing to advertise a second hand Barbie doll or accessory

- Flows
    - Advertiser: {
        - View filtered items by country
        - Register / Login
        - Publish / Manage ads
    }
    - Customer: {
        - View filtered items by country
        - Filter ads
        - Get ad details
        - Contact advertiser
    }

- UI design: TODO

## Technical Description

- Blocks: {
    - Client Side: App with Next JS
    - Server Side: Node Js, Express Js, Next Js, Mongoose
    - Mongo DB
}

- Sequence: {
    - Customer {
        - Home page country guessing with script
        - Redirection to home country website
        - If guessing fails, redirection to ES
        - Ad fetching with filtering
        - Ad previews after filtering
        - Ad custom page with details and contact option
    }
    - Advertiser { 
        - Home page country guessing with script
        - Redirection to home country website
        - If guessing fails, redirection to ES
        - Ad fetching with filtering
        - Ad previews after filtering
        - Ad custom page with details and contact option
        - Register new ad with new account
        - Publish up to 10 ads with same account
        - User control pannel: {
            - Manage ads
            - Manage personal data
            - Publish new ad
        }
    }
}

- Data model {
    - User: {
        - Name, email, password, verified
    }
    - Ad: {
        - User
        - Title
        - Body
        - Location: {
            - Country
            - Province
            - Area
        - Image
        - Categories
        - Price
        - Visibility
        - Verified
        - Created At
        - Modified At
        }
    }
}

- Technologies: {
    - HTML
    - JavaScript
    - CSS
    - Next JS
    - Node
    - Express
    - Mongo DB
}

## Roadmap

- Version 0 {
    - Country guessing
    - Redirection to either MX, ES or AR
    - Homepage with filtered ads per country
    - Ad details page with contact form
    - User registration with first Ad
    - User control panel: {
        - My ads: {
            - Edit or delete ad
            - New ad
        }
        - My data
    }
}

- Version 1 {
    - To be continued...
}

## Tasks

- Sprint 0 {
    - DONE data model
    - DONE data model to mongoose
    - Users logic: {
        - DONE [Create, Retrieve]
        - TODO [Update, Delete]
    }
    - Ads logic: {
        - DONE [Create, Retrieve, Delete]
        - TODO [Update]
    }
}

- Sprint 1 {
    - TODO: Users logic (Update, Delete)
    - TODO: Ads logic (Update)
    - TODO: Login page forgot password logic
    - TODO: {
        - Look for a token sent through body and not through header
        - Check country cookie at publish page
        - Bring unverified ads to user panel to let user know it's under revision
    }
}

