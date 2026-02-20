-- Dead API Detector - Seed Data (50 APIs)
-- Run AFTER schema.sql

INSERT INTO apis (name, url, category) VALUES

-- Development & Testing (9)
('JSONPlaceholder',       'https://jsonplaceholder.typicode.com/posts',                                          'Development'),
('HTTPBin',               'https://httpbin.org/get',                                                             'Development'),
('Reqres',                'https://reqres.in/api/users',                                                         'Development'),
('FakeJSON',              'https://fakejson.com/up',                                                             'Development'),
('Random Data API',       'https://random-data-api.com/api/v2/users',                                           'Development'),
('GitHub API',            'https://api.github.com',                                                              'Development'),
('IP API',                'https://ipapi.co/json',                                                               'Development'),
('My JSON Server',        'https://my-json-server.typicode.com/typicode/demo/posts',                            'Development'),
('Public APIs List',      'https://api.publicapis.org/entries',                                                  'Development'),

-- Weather (6)
('Open-Meteo',            'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true', 'Weather'),
('OpenWeatherMap',        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo',               'Weather'),
('Weather API',           'https://wttr.in/London?format=j1',                                                   'Weather'),
('Meteostat',             'https://meteostat.p.rapidapi.com/stations/nearby?lat=51.51&lon=-0.13',              'Weather'),
('7Timer',                'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json',  'Weather'),
('NOAA Weather',          'https://api.weather.gov',                                                            'Weather'),

-- Cryptocurrency (7)
('CoinGecko',             'https://api.coingecko.com/api/v3/ping',                                             'Cryptocurrency'),
('CoinCap',               'https://api.coincap.io/v2/assets/bitcoin',                                          'Cryptocurrency'),
('Coinbase',              'https://api.coinbase.com/v2/currencies',                                             'Cryptocurrency'),
('Binance',               'https://api.binance.com/api/v3/ping',                                               'Cryptocurrency'),
('CryptoCompare',         'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD',                   'Cryptocurrency'),
('Bitfinex',              'https://api-pub.bitfinex.com/v2/platform/status',                                    'Cryptocurrency'),
('Kraken',                'https://api.kraken.com/0/public/Time',                                              'Cryptocurrency'),

-- Animals (5)
('Dog CEO',               'https://dog.ceo/api/breeds/image/random',                                           'Animals'),
('Cat Facts',             'https://catfact.ninja/fact',                                                         'Animals'),
('The Cat API',           'https://api.thecatapi.com/v1/images/search',                                        'Animals'),
('RandomFox',             'https://randomfox.ca/floof/',                                                        'Animals'),
('Kangaroo Facts',        'https://kangaroo.azurewebsites.net/api/kangaroo',                                   'Animals'),

-- Space (4)
('NASA APOD',             'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',                              'Space'),
('Open Notify ISS',       'http://api.open-notify.org/iss-now.json',                                           'Space'),
('Spaceflight News',      'https://api.spaceflightnewsapi.net/v4/articles/?limit=1',                           'Space'),
('Launch Library 2',      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1',                       'Space'),

-- Finance (5)
('Exchange Rates API',    'https://open.er-api.com/v6/latest/USD',                                             'Finance'),
('Fixer.io',              'https://data.fixer.io/api/latest?access_key=demo',                                  'Finance'),
('Alpha Vantage',         'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo',   'Finance'),
('Frankfurter',           'https://api.frankfurter.app/latest',                                                'Finance'),
('CurrencyAPI',           'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json', 'Finance'),

-- Food & Drink (4)
('The Meal DB',           'https://www.themealdb.com/api/json/v1/1/random.php',                               'Food'),
('The Cocktail DB',       'https://www.thecocktaildb.com/api/json/v1/1/random.php',                           'Food'),
('Open Food Facts',       'https://world.openfoodfacts.org/api/v0/product/737628064502.json',                  'Food'),
('Fruityvice',            'https://fruityvice.com/api/fruit/all',                                              'Food'),

-- Geography (4)
('RestCountries',         'https://restcountries.com/v3.1/all?fields=name,capital,population',                'Geography'),
('GeoNames',              'https://secure.geonames.org/countryInfoJSON?username=demo',                         'Geography'),
('Zippopotam',            'https://api.zippopotam.us/us/90210',                                               'Geography'),
('IP Geolocation',        'https://get.geojs.io/v1/ip/geo.json',                                              'Geography'),

-- Entertainment (6)
('The Movie DB',          'https://api.themoviedb.org/3/movie/popular?api_key=fake_key',                      'Entertainment'),
('Open Library',          'https://openlibrary.org/api/books?bibkeys=ISBN:9780140328721&format=json',         'Entertainment'),
('Joke API',              'https://v2.jokeapi.dev/joke/Programming',                                          'Entertainment'),
('Trivia API',            'https://opentdb.com/api.php?amount=1',                                             'Entertainment'),
('Chuck Norris',          'https://api.chucknorris.io/jokes/random',                                          'Entertainment'),
('Agify',                 'https://api.agify.io?name=michael',                                                'Entertainment')

ON CONFLICT (url) DO NOTHING;
