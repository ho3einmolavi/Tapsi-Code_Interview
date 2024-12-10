const axios = require('axios');

// Define the URL and headers
const url = 'https://iranfile.net/MWS.asmx/Search';
const headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Content-Type': 'application/json',
    'Origin': 'https://iranfile.net',
    'Referer': 'https://iranfile.net/search.aspx?usage=q&srm=sale&ck=apartment',
    'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Cookie': 'FormStyle=simple; _ga=GA1.1.1633348246.1702905031; _ga_34B604LFFQ=GS1.1.1703780807.4.1.1703781270.59.0.0; ASP.NET_SessionId=qo1ijon1zfqe5aoyclo5px5v; fp=3630929828-27270010; perf_dv6Tr4n=1; Eskan3Login=u=Ibf23HrZhnAf+dPtIWeEXQ==&p=dy7KkvOj3xPutV84XVnzBw==; .ASPXAUTH=093F8764583CC1FDB923726B6A5CE192AEDEAF7BCC387A7EAD7FC506E17B69682B7D9DB2E81401599B7AF6FBB2AA8F7048E1313EAC07637E407206259E6A7EFA62131AB9D487E9B40A2C68343ECBDC8C0837459263F924A8032FAC1E395AA5F8562DA62948B2F198814CA8DE2722000489996886; FileCodes=7956001%2C7955757%2C7955811%2C7925095%2C7955785%2C4740161%2C7955840%2C7831912%2C7861872%2C7706407%2C7797044%2C7863156%2C7658400%2C7955608%2C4610184%2C7867920%2C7868977%2C7894545%2C7898543%2C7902332%2C7904979%2C7917614%2C7934122%2C7934778%2C7934782%2C7932242%2C7825481%2C7878476%2C7467208%2C7616691%2C2269464%2C7799774%2C7914468%2C7933557%2C7933996%2C7934814%2C7955519%2C7955576%2C7937993%2C7924390%2C7955606%2C4449108%2C7890702%2C7630934%2C7882002%2C7907339%2C4244725%2C7955521%2C7955349%2C7821485%2C7871832%2C7897192%2C7900012%2C7954775%2C7691382%2C7779725%2C7169724%2C7878232%2C7954271%2C4772905%2C7955178%2C7836150%2C7861560%2C7858739%2C7925960%2C7955101%2C7954945%2C7955107%2C4668816%2C7922408%2C7085744%2C7625525%2C7904526%2C7607290%2C7865376%2C7759839%2C7829072%2C7602268%2C7841362%2C7856310%2C7864193%2C7882116%2C7902505%2C7905313%2C7920798%2C7933872%2C7894274%2C7954338%2C7954472%2C7780652%2C7793687%2C7820262%2C7819229%2C7954659%2C7757907%2C7595663%2C7813827%2C7954394%2C7610387%2C7823241%2C7706909%2C7922418%2C7953942%2C7919179%2C7833776%2C7933357%2C7900566%2C7953959%2C7954183%2C7933483%2C7917327%2C4197197%2C7786248%2C7898509%2C7913444%2C7918772%2C7954149%2C7953397%2C7953660%2C7953722%2C7953774%2C7953772%2C7835867%2C7749849%2C7953601%2C3433720%2C7760468%2C7902472%2C7953440%2C4607398%2C7870695%2C7953335%2C7953083%2C7952993%2C7429301%2C7953283%2C7902270%2C7882874%2C7827976%2C7906759%2C7953153%2C7953190%2C7953142%2C7953012%2C7889263%2C7899777%2C7952830%2C7906977%2C7920810%2C7906755%2C7770142%2C7828947%2C7952514%2C7952521%2C7952486%2C7952602%2C7922102%2C7934847%2C7952585%2C7952779%2C7861429%2C7901444%2C7952492%2C7908823%2C7952681%2C7952520%2C7952572%2C4771413%2C7646356%2C7832601%2C7843331%2C7911936%2C7922161%2C4694748%2C7951940%2C7952029%2C7932329%2C7588505%2C7951863%2C7883959%2C7952140%2C7951997%2C7952061%2C7952118%2C7923277%2C7918407%2C7951995%2C7668541%2C7548908%2C7866265'
};

// Define the data payload (replace this with your actual payload)
const data = {
    "searchParam": {
        "Zc": false,
        "userZcID": -1,
        "Private": false,
        "browser": "Desktop Google Chrome V:125 OsName: Microsoft Windows 10 V:10.0 - screen:w 1536 h 352",
        "Equipments": [],
        "RegionCodes": [
            "54"
        ],
        "DateMin": "1403/02/20",
        "DateMax": "",
        "CaseKind": "apartment",
        "CaseFeature": "",
        "Address1": "",
        "Sale": true,
        "Rent": false,
        "Mortgage": false,
        "Participation": false,
        "Exchange": false,
        "ForeignRent": false,
        "RcParent1": "",
        "RcParent2": "",
        "RcParent3": "",
        "lNorth": false,
        "lEast": false,
        "lWest": false,
        "lSouth": false,
        "lCenter": false,
        "TotalPriceMin": "",
        "TotalPriceMax": "",
        "UnitPriceMin": "",
        "UnitPriceMax": "",
        "AutomaticConvert": false,
        "priceComment": "",
        "BedroomMin": "",
        "BedroomMax": "",
        "AgeMin": "",
        "AgeMax": "",
        "UseAreaMin": "",
        "UseAreaMax": "",
        "FrontMin": "",
        "FrontMax": "",
        "FloorNoMin": "",
        "FloorNoMax": "",
        "Archive": 0,
        "PageNumber": 1,
        "Karshenasi": false,
        "CityID": "23",
        "Tel": "",
        "Owner": "",
        "AdvanceSearch": true,
        "Comment": "",
        "FloorKind": "",
        "FrontKind": "",
        "Kitchen": "",
        "UnitNoAllMin": "",
        "UnitNoAllMax": "",
        "UnitNoMin": "",
        "UnitNoMax": "",
        "Source": "",
        "Publisher": "",
        "North": false,
        "East": false,
        "West": false,
        "South": false,
        "Deleted": false,
        "AreaMin": "",
        "AreaMax": "",
        "IsMobile": false,
        "FingerPrint": "3630929828-27270010"
    }
}
axios.post(url, data, { headers })
    .then(response => {
        // console.log(response.data);
        const d = response.data.d
        const ids = []
        d.forEach(item => {
            ids.push(item[0])
        })
        console.log(ids)
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });
