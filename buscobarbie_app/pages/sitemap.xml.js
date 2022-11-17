import retrieveXMLads from "../logic/retrieveXMLads"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

function generateSiteMap(adsE, adsM, adsA) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${APP_URL}</loc>
     </url>
     <url>
       <loc>${APP_URL}/barbiestories</loc>
     </url>
     <url>
       <loc>${APP_URL}/ES</loc>
     </url>
     <url>
       <loc>${APP_URL}/MX</loc>
     </url>
     <url>
       <loc>${APP_URL}/AR</loc>
     </url>
     <url>
       <loc>${APP_URL}/contact</loc>
     </url>
     <url>
       <loc>${APP_URL}/favorites</loc>
     </url>
     <url>
       <loc>${APP_URL}/login</loc>
     </url>
     <url>
       <loc>${APP_URL}/terms-and-conditions</loc>
     </url>
     <url>
       <loc>${APP_URL}/favorites</loc>
     </url>
     ${adsE
            .map(id => {
                return `
       <url>
           <loc>${`${APP_URL}/ES/ads/${id}`}</loc>
       </url>
     `
            })
            .join('')}
       ${adsM
            .map(id => {
                return `
        <url>
            <loc>${`${APP_URL}/MX/ads/${id}`}</loc>
        </url>
      `
            })
            .join('')}
        ${adsA
            .map(id => {
                return `
            <url>
                <loc>${`${APP_URL}/AR/ads/${id}`}</loc>
            </url>
          `
            })
            .join('')}
   </urlset>
 `
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    try {
        const adsE = await retrieveXMLads('ES')
        const adsM = await retrieveXMLads('MX')
        const adsA = await retrieveXMLads('AR')

        // We generate the XML sitemap with the ads data
        const sitemap = generateSiteMap(adsE, adsM, adsA)

        res.setHeader('Content-Type', 'text/xml')

        // we send the XML to the browser
        res.write(sitemap)
        res.end()

        return {
            props: {}
        }
    } catch (error) {
        res.end()
        return {
            props: {}
        }
    }


}

export default SiteMap