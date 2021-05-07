-- Inside the  postgres database, run the following script.
-- Note that the csv file is in the csv_data folder.
-- on windows, the csv has to be put inside the "C:/users/public"
-- folder for the following code to work, due to administration issue.


CREATE TYPE downUpState AS ENUM ('downstate', 'upstate');
CREATE TYPE nycResident AS ENUM ('NYC', 'notNYC');
CREATE TYPE SecLevel AS ENUM ('max', 'med', 'min');
CREATE TYPE modEthRace AS ENUM ('NH-Black','Hispanic','Other','NH-White');

CREATE TABLE underCustody
(
    id                    SERIAL,
    lastName              VARCHAR(50),
    firstName             VARCHAR(50),
    sex                   CHAR(1),
    dob                   VARCHAR(50),
    ethnicGroup           VARCHAR(50),
    race                  VARCHAR(50),
    originalReceptionDate VARCHAR(50),
    age                   DECIMAL(4, 1),
    timeServed            DECIMAL(4, 1),
    modEthRaceF           VARCHAR(50),
    crimeCounty           VARCHAR(50),
    crimeRegion           VARCHAR(50),
    downstateResident     downUpState,
    nycResident           nycResident,
    homeRegion            VARCHAR(50),
    prisonRegion          VARCHAR(50),
    prison                VARCHAR(50),
    prisonSecLevel        SecLevel,
    prisonLong            Decimal(9,6),
    prisonLat             Decimal(8,6),
    timeServedBinned      VARCHAR(50),
    ageBinned             VARCHAR(50),
    modEthRace            modEthRace,
    PRIMARY KEY (id)
);

COPY underCustody (lastName, firstName, sex, dob, ethnicGroup, race, originalReceptionDate, age, timeServed, modEthRaceF, crimeCounty, crimeRegion,
                          downstateResident, nycResident, homeRegion, prisonRegion, prison, prisonSecLevel, prisonLong, prisonLat, timeServedBinned, ageBinned, modEthRace)
FROM 'C:/users/public/underCustody.csv'
DELIMITER ','
CSV HEADER;

-- GeoJSON ----------------------------------------------------------------------------

CREATE TABLE ny_state_geojson (
  id serial PRIMARY KEY,
  type varchar,
  properties json,
  geometry json
);

COPY ny_state_geojson (id, type, properties, geometry)
FROM 'C:/users/public/ny_state_map.csv'
DELIMITER ','
CSV HEADER;
